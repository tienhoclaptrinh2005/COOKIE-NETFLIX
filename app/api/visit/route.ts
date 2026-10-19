import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSessionFromRequest } from "@/lib/auth";
import { assertSameOrigin, getClientIp } from "@/lib/request";
import {
  TRACKED_PUBLIC_PATHS,
  isLikelyBot,
  recordPublicVisit,
} from "@/lib/traffic";

const VISITOR_COOKIE = "pixel_press_visitor";
const ONE_YEAR_SECONDS = 365 * 24 * 60 * 60;

const schema = z
  .object({
    path: z.enum(TRACKED_PUBLIC_PATHS),
    eventId: z.string().uuid(),
  })
  .strict();

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: NextRequest) {
  if (!assertSameOrigin(request)) return json({ ok: false }, 403);
  if (await getAdminSessionFromRequest(request)) {
    return json({ ok: true, recorded: false });
  }
  if (isLikelyBot(request.headers.get("user-agent"))) {
    return json({ ok: true, recorded: false });
  }

  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return json({ ok: false }, 400);
  }
  const parsed = schema.safeParse(input);
  if (!parsed.success) return json({ ok: false }, 400);

  const storedVisitorId = request.cookies.get(VISITOR_COOKIE)?.value;
  const validVisitorId = z.string().uuid().safeParse(storedVisitorId);
  const visitorId = validVisitorId.success ? validVisitorId.data : randomUUID();

  try {
    const result = await recordPublicVisit({
      path: parsed.data.path,
      eventId: parsed.data.eventId,
      visitorId,
      ip: getClientIp(request),
    });
    const response = json({ ok: true, recorded: result === "recorded" });
    if (!validVisitorId.success) {
      response.cookies.set(VISITOR_COOKIE, visitorId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: ONE_YEAR_SECONDS,
      });
    }
    return response;
  } catch {
    return json({ ok: false }, 503);
  }
}
