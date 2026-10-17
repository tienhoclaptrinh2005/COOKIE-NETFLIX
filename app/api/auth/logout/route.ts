import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth";
import { assertSameOrigin } from "@/lib/request";
import { getRequestDictionary } from "@/lib/i18n";

export async function POST(request: NextRequest) {
  const copy = getRequestDictionary(request);
  if (!assertSameOrigin(request)) return NextResponse.json({ error: copy.apiWrongOrigin }, { status: 403 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 0 });
  return response;
}
