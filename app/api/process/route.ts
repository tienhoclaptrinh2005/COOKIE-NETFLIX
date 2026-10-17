import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkModes, safeReference, verifyCookie } from "@/lib/checker";
import { appIncr } from "@/lib/redis";
import { assertSameOrigin } from "@/lib/request";
import { getRequestDictionary } from "@/lib/i18n";

const payloadSchema = z.object({
  cookieData: z.string().trim().min(16).max(16_000),
  mode: z.enum(checkModes).default("fullinfo"),
});

export async function POST(request: NextRequest) {
  const copy = getRequestDictionary(request);
  if (!assertSameOrigin(request)) return NextResponse.json({ error: copy.apiWrongOrigin }, { status: 403 });

  let json: unknown;
  try { json = await request.json(); } catch { return NextResponse.json({ error: copy.apiInvalidPayload }, { status: 400 }); }
  const parsed = payloadSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: copy.apiCookieLength }, { status: 400 });

  const result = await verifyCookie(parsed.data.cookieData, parsed.data.mode, copy);
  await Promise.all([appIncr("thong_ke:tong"), appIncr(`thong_ke:${result.status.toLowerCase()}`)]);

  return NextResponse.json({
    ...result,
    reference: safeReference(parsed.data.cookieData),
    checkedAt: new Date().toISOString(),
    remaining: null,
  }, { headers: { "Cache-Control": "no-store" } });
}
