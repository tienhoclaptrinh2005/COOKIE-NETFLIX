import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSessionFromRequest } from "@/lib/auth";
import { appDeletePattern } from "@/lib/redis";
import { assertSameOrigin } from "@/lib/request";
import { getRedisOverview } from "@/lib/system";
import { getRequestDictionary } from "@/lib/i18n";

export async function GET(request: NextRequest) {
  const copy = getRequestDictionary(request);
  if (!(await getAdminSessionFromRequest(request))) return NextResponse.json({ error: copy.apiUnauthorized }, { status: 401 });
  return NextResponse.json(await getRedisOverview(), { headers: { "Cache-Control": "no-store" } });
}

export async function DELETE(request: NextRequest) {
  const copy = getRequestDictionary(request);
  if (!assertSameOrigin(request)) return NextResponse.json({ error: copy.apiWrongOrigin }, { status: 403 });
  if (!(await getAdminSessionFromRequest(request))) return NextResponse.json({ error: copy.apiUnauthorized }, { status: 401 });
  let input: unknown;
  try { input = await request.json(); } catch { return NextResponse.json({ error: copy.apiInvalidRequest }, { status: 400 }); }
  const parsed = z.object({ pattern: z.enum(["han_muc_nhan:*", "dang_nhap:that_bai:*", "thong_ke:*"]) }).safeParse(input);
  if (!parsed.success) return NextResponse.json({ error: copy.apiInvalidNamespace }, { status: 400 });
  const removed = await appDeletePattern(parsed.data.pattern);
  return NextResponse.json({ ok: true, removed });
}
