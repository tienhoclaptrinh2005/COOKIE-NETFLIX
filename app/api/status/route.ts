import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionFromRequest } from "@/lib/auth";
import { quotaForIp } from "@/lib/quota";
import { getClientIp } from "@/lib/request";
import { maskIp } from "@/lib/utils";
import { checkVpn } from "@/lib/vpn";
import { pingRedis, redis } from "@/lib/redis";
import { getRequestLocale } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const locale = getRequestLocale(request);
  const [session, quota, vpn, redisOnline] = await Promise.all([
    getAdminSessionFromRequest(request),
    quotaForIp(ip),
    checkVpn(ip, locale),
    pingRedis(),
  ]);

  return NextResponse.json({
    ip: maskIp(ip),
    vpn,
    quota: session ? { limit: 0, used: 0, remaining: 0, unlimited: true } : quota,
    role: session ? "admin" : "guest",
    redis: redis ? (redisOnline ? "ONLINE" : "DEGRADED") : "DEGRADED",
  }, { headers: { "Cache-Control": "no-store" } });
}
