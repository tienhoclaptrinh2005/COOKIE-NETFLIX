import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionFromRequest } from "@/lib/auth";
import { getSystemStats } from "@/lib/system";
import { getRequestDictionary } from "@/lib/i18n";

export async function GET(request: NextRequest) {
  const copy = getRequestDictionary(request);
  if (!(await getAdminSessionFromRequest(request))) return NextResponse.json({ error: copy.apiUnauthorized }, { status: 401 });
  return NextResponse.json(await getSystemStats(), { headers: { "Cache-Control": "no-store" } });
}
