import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSessionFromRequest } from "@/lib/auth";
import { safeReference, verifyCookie } from "@/lib/checker";
import { getRequestDictionary, getRequestLocale } from "@/lib/i18n";
import { consumeQuota, refundQuota } from "@/lib/quota";
import { appAdjust, removeCookieCandidate, sampleCookieCandidates, type CookieCandidate } from "@/lib/redis";
import { assertSameOrigin, getClientIp } from "@/lib/request";
import { checkVpn } from "@/lib/vpn";

export const maxDuration = 60;

const payloadSchema = z.object({ quantity: z.number().int().min(1).max(20).default(1) });

type CheckedCandidate = {
  candidate: CookieCandidate;
  result: Awaited<ReturnType<typeof verifyCookie>>;
};

async function safeRefund(ip: string) {
  try { await refundQuota(ip); } catch { /* Keep the API response stable if telemetry Redis is unavailable. */ }
}

export async function POST(request: NextRequest) {
  const copy = getRequestDictionary(request);
  const locale = getRequestLocale(request);
  if (!assertSameOrigin(request)) return NextResponse.json({ error: copy.apiWrongOrigin }, { status: 403 });

  let input: unknown;
  try { input = await request.json(); } catch { return NextResponse.json({ error: copy.apiInvalidPayload }, { status: 400 }); }
  const parsed = payloadSchema.safeParse(input);
  if (!parsed.success) return NextResponse.json({ error: copy.apiReceiveQuantity }, { status: 400 });

  const session = await getAdminSessionFromRequest(request);
  const quantity = session ? parsed.data.quantity : 1;
  const ip = getClientIp(request);
  let quotaReserved = false;
  let remaining: number | null = null;

  if (!session) {
    const vpn = await checkVpn(ip, locale);
    if (vpn.state === "DETECTED") return NextResponse.json({ error: copy.apiVpnBlocked }, { status: 403 });
    const quota = await consumeQuota(ip);
    if (!quota.allowed) return NextResponse.json({ error: copy.apiQuotaExhausted }, { status: 429 });
    quotaReserved = true;
    remaining = quota.remaining;
  }

  const deliveries: Array<{ directLoginUrl: string; reference: string }> = [];
  const seen = new Set<string>();
  let attempts = 0;
  let removedDead = 0;
  const maxAttempts = Math.min(100, Math.max(8, quantity * 8));

  try {
    while (deliveries.length < quantity && attempts < maxAttempts) {
      const openSlots = quantity - deliveries.length;
      const batchSize = Math.min(5, maxAttempts - attempts, Math.max(3, openSlots * 2));
      const sampled = await sampleCookieCandidates(Math.min(20, batchSize * 3));
      const batch = sampled
        .filter((candidate) => {
          const identity = `${candidate.pool}:${safeReference(candidate.cookie)}`;
          if (seen.has(identity)) return false;
          seen.add(identity);
          return true;
        })
        .slice(0, batchSize);

      if (!batch.length) break;
      attempts += batch.length;

      const checked: CheckedCandidate[] = await Promise.all(batch.map(async (candidate) => ({
        candidate,
        result: await verifyCookie(candidate.cookie, "tokenonly", copy),
      })));

      for (const item of checked) {
        if (item.result.status === "DIE") {
          removedDead += Number(await removeCookieCandidate(item.candidate)) || 0;
          continue;
        }
        if (item.result.status !== "LIVE" || !item.result.directLoginUrl || deliveries.length >= quantity) continue;
        deliveries.push({
          directLoginUrl: item.result.directLoginUrl,
          reference: safeReference(item.candidate.cookie),
        });
      }
    }

    if (!deliveries.length) {
      if (quotaReserved) await safeRefund(ip);
      return NextResponse.json({ error: copy.apiReceiveUnavailable }, { status: 503, headers: { "Cache-Control": "no-store, private" } });
    }

    await Promise.all([
      appAdjust("nhan:yeu_cau", 1),
      appAdjust("nhan:da_cap", deliveries.length),
      removedDead > 0 ? appAdjust("nhan:loai_bo", removedDead) : Promise.resolve(0),
    ]).catch(() => undefined);

    return NextResponse.json({
      role: session ? "admin" : "guest",
      requested: quantity,
      delivered: deliveries.length,
      items: deliveries,
      remaining,
      checkedAt: new Date().toISOString(),
      message: deliveries.length === quantity ? copy.apiReceiveSuccess : copy.apiReceivePartial,
    }, { headers: { "Cache-Control": "no-store, private" } });
  } catch {
    if (quotaReserved) await safeRefund(ip);
    return NextResponse.json({ error: copy.apiReceiveFailed }, { status: 502, headers: { "Cache-Control": "no-store, private" } });
  }
}
