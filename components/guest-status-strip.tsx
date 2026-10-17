"use client";

import { useCallback, useEffect, useState } from "react";
import { Cpu, Gauge, Globe2, Radar, RotateCcw, ShieldCheck, ShieldQuestion, WifiOff } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { PixelButton } from "@/components/ui/pixel-button";
import { PixelPanel } from "@/components/ui/pixel-panel";
import { PixelProgress } from "@/components/ui/pixel-progress";
import { StatusBadge } from "@/components/ui/status-badge";

type PublicStatus = {
  ip: string;
  vpn: { state: "CLEAR" | "DETECTED" | "UNCHECKED"; detail: string };
  quota: { limit: number; used: number; remaining: number; unlimited?: boolean };
  role: "admin" | "guest";
  redis: "ONLINE" | "DEGRADED";
};

function StatusSkeleton() {
  const { copy } = useI18n();
  return <div className="h-32 animate-pulse border-2 border-border bg-[#071126]" aria-label={copy.guestStatusLoading} />;
}

function CompactStat({ icon: Icon, label, value, tone = "blue" }: { icon: typeof Globe2; label: string; value: string; tone?: "blue" | "green" | "yellow" | "red" }) {
  const colors = { blue: "text-blue", green: "text-primary", yellow: "text-yellow", red: "text-red" };
  return (
    <div className="min-w-0 border-2 border-border bg-[#071126] p-3 sm:p-4">
      <div className="mb-2 flex items-center gap-2 text-muted">
        <Icon aria-hidden="true" className={`size-4 shrink-0 ${colors[tone]}`} strokeWidth={2.5} />
        <span className="font-pixel text-[7px] uppercase leading-relaxed sm:text-[8px]">{label}</span>
      </div>
      <p className={`min-w-0 font-pixel text-[9px] leading-relaxed [overflow-wrap:anywhere] ${colors[tone]}`}>{value}</p>
    </div>
  );
}

export function GuestStatusStrip() {
  const { copy } = useI18n();
  const [status, setStatus] = useState<PublicStatus | null>(null);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const loadStatus = useCallback(async (showProgress = false) => {
    if (showProgress) setRefreshing(true);
    try {
      const response = await fetch("/api/status", { cache: "no-store" });
      if (!response.ok) throw new Error(copy.guestStatusUnavailable);
      setStatus((await response.json()) as PublicStatus);
      setError("");
    } catch {
      setError(copy.guestConnectionError);
    } finally {
      if (showProgress) setRefreshing(false);
    }
  }, [copy]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/status", { cache: "no-store", signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(copy.guestStatusUnavailable);
        return response.json() as Promise<PublicStatus>;
      })
      .then((data) => {
        setStatus(data);
        setError("");
      })
      .catch((cause: unknown) => {
        if (cause instanceof DOMException && cause.name === "AbortError") return;
        setError(copy.guestConnectionError);
      });

    const refresh = () => void loadStatus();
    window.addEventListener("pixel-press:status-refresh", refresh);
    return () => {
      controller.abort();
      window.removeEventListener("pixel-press:status-refresh", refresh);
    };
  }, [copy, loadStatus]);

  const vpnTone = status?.vpn.state === "CLEAR" ? "green" : status?.vpn.state === "DETECTED" ? "red" : "yellow";
  const vpnLabel = status?.vpn.state === "CLEAR" ? copy.guestVpnClear : status?.vpn.state === "DETECTED" ? copy.guestVpnBlocked : copy.guestVpnUnchecked;

  return (
    <section className="mt-8 grid items-stretch gap-4 lg:grid-cols-3" aria-label={copy.guestAsideAria}>
      <PixelPanel title={copy.guestPlayerStatus} eyebrow={copy.guestNetworkTelemetry} accent="blue" className="h-full">
        <div className="space-y-3 p-4">
          {!status ? <StatusSkeleton /> : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <CompactStat icon={Globe2} label={copy.guestMaskedIp} value={status.ip} tone="blue" />
                <CompactStat icon={status.vpn.state === "CLEAR" ? ShieldCheck : status.vpn.state === "DETECTED" ? WifiOff : ShieldQuestion} label={copy.guestVpnProxy} value={vpnLabel} tone={vpnTone} />
              </div>
              <div className="border-2 border-border bg-[#071126] p-3 sm:p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="font-pixel text-[8px] uppercase leading-relaxed text-muted">{copy.guestAccessClass}</span>
                  <StatusBadge tone={status.role === "admin" ? "info" : "live"}>{status.role === "admin" ? copy.guestRoleAdmin : copy.guestRoleGuest}</StatusBadge>
                </div>
                <p className="mt-2 text-base leading-snug text-muted">{status.vpn.detail}</p>
              </div>
            </>
          )}
        </div>
      </PixelPanel>

      <PixelPanel title={copy.guestDailyCredits} eyebrow={copy.guestResetTime} accent="yellow" className="h-full">
        <div className="p-4">
          {!status ? <StatusSkeleton /> : status.quota.unlimited ? (
            <div className="grid min-h-32 place-items-center text-center">
              <div><p className="font-pixel text-3xl text-yellow neon-blue">∞</p><p className="mt-3 text-lg text-muted">{copy.guestAdminUnlimited}</p></div>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-end justify-between gap-4">
                <div><p className="font-pixel text-[8px] uppercase text-muted">{copy.guestRemaining}</p><p className="mt-2 font-pixel text-3xl text-yellow">{status.quota.remaining}</p></div>
                <Gauge aria-hidden="true" className="size-10 text-yellow" strokeWidth={1.5} />
              </div>
              <PixelProgress value={status.quota.used} max={status.quota.limit} label={copy.guestCreditsUsed} />
              <p className="mt-4 text-base leading-snug text-muted">{copy.guestCreditNotice}</p>
            </>
          )}
        </div>
      </PixelPanel>

      <PixelPanel title={copy.guestSystemLink} eyebrow={copy.guestRuntimeStatus} accent="green" className="h-full">
        <div className="grid grid-cols-2 gap-3 p-4">
          <CompactStat icon={Cpu} label={copy.guestProcessor} value={copy.guestReady} tone="green" />
          <CompactStat icon={Radar} label="Redis" value={status?.redis ?? "..."} tone={status?.redis === "ONLINE" ? "green" : "yellow"} />
        </div>
        <div className="border-t-2 border-border p-4">
          <PixelButton variant="secondary" size="sm" disabled={refreshing} onClick={() => void loadStatus(true)} className="w-full">
            <RotateCcw aria-hidden="true" className={`size-4 ${refreshing ? "animate-spin" : ""}`} /> {copy.guestRefresh}
          </PixelButton>
        </div>
      </PixelPanel>

      {error && <p role="alert" className="lg:col-span-3 border-2 border-red bg-[#2b0810] p-3 text-base text-[#ff9ca5]">{error}</p>}
    </section>
  );
}
