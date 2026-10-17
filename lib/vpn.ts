import { getDictionary, type Locale } from "@/lib/i18n";

export type VpnState = "CLEAR" | "DETECTED" | "UNCHECKED";

type VpnProviderResponse = {
  vpn?: boolean;
  proxy?: boolean;
  tor?: boolean;
  relay?: boolean;
  is_vpn?: boolean;
  is_proxy?: boolean;
  is_tor?: boolean;
  is_relay?: boolean;
  is_anonymous?: boolean;
  security?: {
    vpn?: boolean;
    proxy?: boolean;
    tor?: boolean;
    relay?: boolean;
  };
};

export async function checkVpn(ip: string, locale: Locale = "vi"): Promise<{ state: VpnState; detail: string }> {
  const copy = getDictionary(locale);
  const endpoint = process.env.VPN_CHECK_URL;
  if (!endpoint) return { state: "UNCHECKED", detail: copy.vpnNotConfigured };
  try {
    const requestUrl = new URL(endpoint.replace("{ip}", encodeURIComponent(ip)));
    const token = process.env.VPN_CHECK_TOKEN;
    const isVpnApi = requestUrl.hostname === "vpnapi.io" || requestUrl.hostname.endsWith(".vpnapi.io");

    // VPNAPI.io authenticates with ?key=..., while other supported providers
    // commonly use a Bearer token. Both values stay server-side.
    if (isVpnApi && token) requestUrl.searchParams.set("key", token);

    const response = await fetch(requestUrl, {
      headers: token && !isVpnApi ? { Authorization: `Bearer ${token}` } : undefined,
      cache: "no-store",
      signal: AbortSignal.timeout(4500),
    });
    if (!response.ok) return { state: "UNCHECKED", detail: copy.vpnUnavailable };
    const data = (await response.json()) as VpnProviderResponse;
    const detected = Boolean(
      data.vpn ||
      data.proxy ||
      data.tor ||
      data.relay ||
      data.is_vpn ||
      data.is_proxy ||
      data.is_tor ||
      data.is_relay ||
      data.is_anonymous ||
      data.security?.vpn ||
      data.security?.proxy ||
      data.security?.tor ||
      data.security?.relay,
    );
    return { state: detected ? "DETECTED" : "CLEAR", detail: detected ? copy.vpnDetected : copy.vpnDirect };
  } catch {
    return { state: "UNCHECKED", detail: copy.vpnTimeout };
  }
}
