import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSessionFromRequest } from "@/lib/auth";
import { getDailyLimit } from "@/lib/quota";
import { appSet } from "@/lib/redis";
import { assertSameOrigin } from "@/lib/request";
import { getRequestDictionary } from "@/lib/i18n";
import { announcementConfigSchema, getAnnouncementConfig, saveAnnouncementConfig } from "@/lib/announcement";

const settingsSchema = z.union([
  z.object({ dailyLimit: z.number().int().min(1).max(100) }).strict(),
  z.object({ announcement: announcementConfigSchema }).strict(),
]);

export async function GET(request: NextRequest) {
  const copy = getRequestDictionary(request);
  if (!(await getAdminSessionFromRequest(request))) return NextResponse.json({ error: copy.apiUnauthorized }, { status: 401 });
  const [dailyLimit, announcement] = await Promise.all([getDailyLimit(), getAnnouncementConfig()]);
  return NextResponse.json({ dailyLimit, announcement }, { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(request: NextRequest) {
  const copy = getRequestDictionary(request);
  if (!assertSameOrigin(request)) return NextResponse.json({ error: copy.apiWrongOrigin }, { status: 403 });
  if (!(await getAdminSessionFromRequest(request))) return NextResponse.json({ error: copy.apiUnauthorized }, { status: 401 });
  let input: unknown;
  try { input = await request.json(); } catch { return NextResponse.json({ error: copy.apiInvalidRequest }, { status: 400 }); }
  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) {
    const quotaUpdate = typeof input === "object" && input !== null && "dailyLimit" in input;
    return NextResponse.json({ error: quotaUpdate ? copy.apiInvalidLimit : copy.apiInvalidSettings }, { status: 400 });
  }
  if ("dailyLimit" in parsed.data) {
    await appSet("cau_hinh:gioi_han_ngay", parsed.data.dailyLimit);
    return NextResponse.json({ ok: true, dailyLimit: parsed.data.dailyLimit });
  }
  const announcement = await saveAnnouncementConfig(parsed.data.announcement);
  return NextResponse.json({ ok: true, announcement });
}
