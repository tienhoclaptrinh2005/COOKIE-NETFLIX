import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { LOCALE_COOKIE } from "@/lib/i18n";
import { assertSameOrigin } from "@/lib/request";

const schema = z.object({ locale: z.enum(["vi", "en"]) });

export async function POST(request: NextRequest) {
  if (!assertSameOrigin(request)) return NextResponse.json({ ok: false }, { status: 403 });
  let input: unknown;
  try { input = await request.json(); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }
  const parsed = schema.safeParse(input);
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });

  const response = NextResponse.json({ ok: true, locale: parsed.data.locale });
  response.cookies.set(LOCALE_COOKIE, parsed.data.locale, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 365 * 24 * 60 * 60,
  });
  return response;
}
