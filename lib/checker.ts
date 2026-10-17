import { createHash } from "node:crypto";
import type { Dictionary } from "@/lib/i18n";

export const checkModes = ["fullinfo", "tokenonly", "infoonly"] as const;
export type CheckMode = (typeof checkModes)[number];
export type CheckStatus = "LIVE" | "DIE" | "UNKNOWN";

export type AccountInfo = {
  country: string;
  language: string;
  phone: string;
  paymentHold: string;
  hasAds: string;
  hasService: string;
};

type CheckerResponse = {
  status?: string;
  message?: string;
  account_info?: Record<string, unknown>;
  token?: unknown;
  token_info?: Record<string, unknown>;
  mode?: unknown;
};

export type VerificationResult = {
  status: CheckStatus;
  message: string;
  mode: CheckMode;
  accountInfo?: AccountInfo;
  directLoginUrl?: string;
};

export function safeReference(input: string) {
  return `PP-${createHash("sha256").update(input).digest("hex").slice(0, 10).toUpperCase()}`;
}

function safeText(value: unknown, maximum = 160) {
  if (typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean") return "—";
  const text = String(value).trim();
  return text ? text.slice(0, maximum) : "—";
}

function normalizeAccountInfo(value: CheckerResponse["account_info"]): AccountInfo | undefined {
  if (!value || typeof value !== "object") return undefined;
  const accountInfo = {
    country: safeText(value.country),
    language: safeText(value.language),
    phone: safeText(value.phone),
    paymentHold: safeText(value.on_payment_hold),
    hasAds: safeText(value.has_ads),
    hasService: safeText(value.has_service),
  };
  return Object.values(accountInfo).some((entry) => entry !== "—") ? accountInfo : undefined;
}

function safeNetflixUrl(value: unknown) {
  if (typeof value !== "string" || value.length > 8_000) return undefined;
  try {
    const url = new URL(value.trim());
    const hostname = url.hostname.toLowerCase();
    if (url.protocol !== "https:" || (hostname !== "netflix.com" && !hostname.endsWith(".netflix.com"))) return undefined;
    return value.trim();
  } catch {
    return undefined;
  }
}

function normalizeSuccess(data: CheckerResponse, mode: CheckMode, message: string, copy: Dictionary): VerificationResult {
  const accountInfo = mode === "tokenonly" ? undefined : normalizeAccountInfo(data.account_info);
  const directLoginUrl = mode === "infoonly"
    ? undefined
    : safeNetflixUrl(data.token_info?.direct_login_url)
      ?? safeNetflixUrl(data.token_info?.token)
      ?? safeNetflixUrl(data.token);

  if (mode === "tokenonly" && !directLoginUrl) return { status: "DIE", message: copy.apiCookieDie, mode };
  if (mode === "infoonly" && !accountInfo) return { status: "UNKNOWN", message: copy.apiVerifierInvalid, mode };
  if (mode === "fullinfo" && !accountInfo && !directLoginUrl) return { status: "UNKNOWN", message: copy.apiVerifierInvalid, mode };

  return {
    status: "LIVE",
    message,
    mode,
    ...(accountInfo ? { accountInfo } : {}),
    ...(directLoginUrl ? { directLoginUrl } : {}),
  };
}

export async function verifyCookie(cookieData: string, mode: CheckMode, copy: Dictionary): Promise<VerificationResult> {
  const endpoint = process.env.CHECKER_API_URL;
  if (!endpoint) {
    const hasKnownField = /(?:^|;\s*)(?:NetflixId|SecureNetflixId)=([^;]+)/i.test(cookieData);
    return hasKnownField
      ? { status: "UNKNOWN", message: copy.apiCookieRecognized, mode }
      : { status: "DIE", message: copy.apiCookieFieldsMissing, mode };
  }

  try {
    const checkerUrl = new URL(endpoint);
    const isCkNetflix = checkerUrl.hostname === "cknetflix.vercel.app";
    if (isCkNetflix) {
      checkerUrl.pathname = mode === "infoonly" ? "/api/check-info" : "/api/check";
      checkerUrl.search = "";
      checkerUrl.hash = "";
    }

    const response = await fetch(checkerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.CHECKER_API_TOKEN ? { Authorization: `Bearer ${process.env.CHECKER_API_TOKEN}` } : {}),
      },
      body: JSON.stringify(isCkNetflix ? { content: cookieData, mode } : { cookie: cookieData, mode }),
      cache: "no-store",
      signal: AbortSignal.timeout(12_000),
    });
    const data = await response.json() as CheckerResponse;
    const rawStatus = data.status?.toUpperCase();

    if (["LIVE", "DIE", "UNKNOWN"].includes(rawStatus ?? "")) {
      const status = rawStatus as CheckStatus;
      if (status === "LIVE") return normalizeSuccess(data, mode, copy.apiCookieLive, copy);
      return { status, mode, message: status === "DIE" ? copy.apiCookieDie : copy.apiCookieUnknown };
    }

    if (isCkNetflix) {
      if (response.ok && rawStatus === "SUCCESS") return normalizeSuccess(data, mode, copy.apiCookieAccepted, copy);
      if (rawStatus === "ERROR") {
        const message = data.message?.slice(0, 240) || "";
        const invalidSession = /no netflixid|invalid (?:account|cookie)|cookie.*invalid|expired|redirected|unauthori[sz]ed/i.test(message);
        return invalidSession
          ? { status: "DIE", message: copy.apiCookieRedirected, mode }
          : { status: "UNKNOWN", message: copy.apiVerifierUnknown, mode };
      }
    }

    if (!response.ok) return { status: "UNKNOWN", message: copy.apiVerifierInvalid, mode };
    return { status: "UNKNOWN", message: copy.apiVerifierUnsupported, mode };
  } catch {
    return { status: "UNKNOWN", message: copy.apiVerifierTimeout, mode };
  }
}
