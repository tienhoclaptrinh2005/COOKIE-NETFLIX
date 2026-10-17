import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { SESSION_COOKIE, authConfigured, clearLoginAttempts, createAdminToken, loginAttemptState, recordFailedLogin, verifyAdminCredentials } from "@/lib/auth";
import { assertSameOrigin, getClientIp } from "@/lib/request";
import { getRequestDictionary } from "@/lib/i18n";

const schema = z.object({ username: z.string().trim().min(1).max(80), password: z.string().min(12).max(200) });

export async function POST(request: NextRequest) {
  const copy = getRequestDictionary(request);
  if (!assertSameOrigin(request)) return NextResponse.json({ error: copy.apiWrongOrigin }, { status: 403 });
  if (!authConfigured()) return NextResponse.json({ error: copy.apiAuthNotConfigured }, { status: 503 });
  const ip = getClientIp(request);
  const attempts = await loginAttemptState(ip);
  if (attempts.blocked) return NextResponse.json({ error: copy.apiTooManyAttempts }, { status: 429 });

  let input: unknown;
  try { input = await request.json(); } catch { return NextResponse.json({ error: copy.apiInvalidLoginData }, { status: 400 }); }
  const parsed = schema.safeParse(input);
  if (!parsed.success) return NextResponse.json({ error: copy.apiLoginRequired }, { status: 400 });

  if (!(await verifyAdminCredentials(parsed.data.username, parsed.data.password))) {
    await recordFailedLogin(ip);
    return NextResponse.json({ error: copy.apiBadCredentials }, { status: 401 });
  }

  await clearLoginAttempts(ip);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, await createAdminToken(parsed.data.username), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 8 * 60 * 60,
  });
  return response;
}
