import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { appDeleteFields, appGet, appIncr } from "@/lib/redis";
import { hashIdentifier } from "@/lib/request";

export const SESSION_COOKIE = "pixel_press_session";
const MAX_ATTEMPTS = 5;

export type AdminSession = {
  sub: string;
  role: "admin";
};

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) return null;
  return new TextEncoder().encode(value);
}

export function authConfigured() {
  return Boolean(secret() && process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD_HASH);
}

export async function verifyAdminCredentials(username: string, password: string) {
  if (!authConfigured()) return false;
  const expected = process.env.ADMIN_USERNAME!;
  const sameName = username.length === expected.length && username === expected;
  if (!sameName) {
    await bcrypt.compare(password, "$2b$12$Jq7kR8Qx6xRUcxKNns0bSO3AAeyzBXEE54dPxTZzZVdzP2ER1K6wK");
    return false;
  }
  return bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH!);
}

export async function createAdminToken(username: string) {
  const key = secret();
  if (!key) throw new Error("Chưa cấu hình khóa bảo mật đăng nhập.");
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(username)
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(key);
}

export async function verifyAdminToken(token?: string | null): Promise<AdminSession | null> {
  const key = secret();
  if (!token || !key) return null;
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    if (payload.role !== "admin" || !payload.sub) return null;
    return { role: "admin", sub: payload.sub };
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const store = await cookies();
  return verifyAdminToken(store.get(SESSION_COOKIE)?.value);
}

export async function getAdminSessionFromRequest(request: NextRequest) {
  return verifyAdminToken(request.cookies.get(SESSION_COOKIE)?.value);
}

export async function loginAttemptState(ip: string) {
  const key = `dang_nhap:that_bai:${hashIdentifier(ip)}`;
  const count = Number(await appGet(key)) || 0;
  return { key, count, blocked: count >= MAX_ATTEMPTS };
}

export async function recordFailedLogin(ip: string) {
  const state = await loginAttemptState(ip);
  return appIncr(state.key, 15 * 60);
}

export async function clearLoginAttempts(ip: string) {
  const state = await loginAttemptState(ip);
  return appDeleteFields(state.key);
}
