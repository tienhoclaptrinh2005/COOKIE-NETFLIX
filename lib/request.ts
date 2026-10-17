import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";

export function getClientIp(request: NextRequest | Request) {
  const headers = request.headers;
  return (
    headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "127.0.0.1"
  );
}

export function hashIdentifier(value: string) {
  const salt = process.env.AUTH_SECRET || "pixel-press-development";
  return createHash("sha256").update(`${salt}:${value}`).digest("hex").slice(0, 24);
}

export function assertSameOrigin(request: NextRequest | Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return process.env.NODE_ENV !== "production";
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
