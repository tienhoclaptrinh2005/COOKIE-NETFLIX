"use client";

import { useCallback, useEffect, useState } from "react";
import { Cpu, Gauge, Globe2, Radar, RotateCcw, ShieldCheck, ShieldQuestion, UserRoundCheck, WifiOff } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { PixelButton } from "@/components/ui/pixel-button";
import { PixelPanel } from "@/components/ui/pixel-panel";
import { PixelProgress } from "@/components/ui/pixel-progress";
import { cn } from "@/lib/utils";

type PublicStatus = {
  ip: string;
  vpn: { state: "CLEAR" | "DETECTED" | "UNCHECKED"; detail: string };
  quota: { limit: number; used: number; remaining: number; unlimited?: boolean };
  role: "admin" | "guest";
  redis: "ONLINE" | "DEGRADED";
};

function StatusSkeleton() {
  const { copy } = useI18n();
  return <div className="h-12 animate-pulse border-2 border-border bg-[#071126]" aria-label={copy.guestStatusLoading} />;
}

function CompactStat({ icon: Icon, label, value, tone = "blue", className }: { icon: typeof Globe2; label: string; value: string; tone?: "blue" | "green" | "yellow" | "red"; className?: string }) {
  const colors = { blue: "text-blue", green: "text-primary", yellow: "text-yellow", red: "text-red" };
  return (
    <div className={cn("min-w-0 border-2 border-border bg-[#071126] p-2", className)}>
      <div className="mb-0.5 flex items-center gap-1.5 text-muted">
        <Icon aria-hidden="true" className={`size-3 shrink-0 ${colors[tone]}`} strokeWidth={2.5} />
        <span className="font-pixel text-[6px] uppercase leading-relaxed">{label}</span>
      </div>
      <p className={`min-w-0 font-pixel text-[7px] leading-relaxed [overflow-wrap:anywhere] ${colors[tone]}`}>{value}</p>
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
    <section className="grid min-w-0 gap-2" aria-label={copy.guestAsideAria}>
      <PixelPanel compact title={copy.guestPlayerStatus} eyebrow={copy.guestNetworkTelemetry} accent="blue">
        <div className="p-2">
          {!status ? <StatusSkeleton /> : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <CompactStat icon={Globe2} label={copy.guestMaskedIp} value={status.ip} tone="blue" />
              <CompactStat icon={status.vpn.state === "CLEAR" ? ShieldCheck : status.vpn.state === "DETECTED" ? WifiOff : ShieldQuestion} label={copy.guestVpnProxy} value={vpnLabel} tone={vpnTone} />
              <CompactStat className="col-span-2 sm:col-span-1" icon={UserRoundCheck} label={copy.guestAccessClass} value={status.role === "admin" ? copy.guestRoleAdmin : copy.guestRoleGuest} tone={status.role === "admin" ? "blue" : "green"} />
            </div>
          )}
        </div>
      </PixelPanel>

      <PixelPanel compact title={copy.guestDailyCredits} eyebrow={copy.guestResetTime} accent="yellow">
        <div className="p-2">
          {!status ? <StatusSkeleton /> : status.quota.unlimited ? (
            <div className="flex min-h-12 items-center justify-center gap-4 text-center">
              <p className="font-pixel text-xl text-yellow neon-blue">∞</p><p className="text-sm text-muted">{copy.guestAdminUnlimited}</p>
            </div>
          ) : (
            <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
              <div className="flex items-baseline gap-2">
                <p className="font-pixel text-[6px] uppercase text-muted">{copy.guestRemaining}</p>
                <p className="font-pixel text-xl text-yellow">{status.quota.remaining}</p>
              </div>
              <PixelProgress className="space-y-1 [&>div:first-child]:text-[6px] [&>div:last-child]:h-3 [&>div:last-child]:p-[2px]" value={status.quota.used} max={status.quota.limit} label={copy.guestCreditsUsed} />
              <Gauge aria-hidden="true" className="size-6 text-yellow" strokeWidth={1.75} />
            </div>
          )}
        </div>
      </PixelPanel>

      <PixelPanel compact title={copy.guestSystemLink} eyebrow={copy.guestRuntimeStatus} accent="green">
        <div className="grid grid-cols-[1fr_1fr_auto] gap-2 p-2">
          <CompactStat icon={Cpu} label={copy.guestProcessor} value={copy.guestReady} tone="green" />
          <CompactStat icon={Radar} label="Redis" value={status?.redis ?? "..."} tone={status?.redis === "ONLINE" ? "green" : "yellow"} />
          <PixelButton variant="secondary" size="sm" disabled={refreshing} onClick={() => void loadStatus(true)} className="min-h-0 self-stretch px-3 py-1 text-[7px]">
            <RotateCcw aria-hidden="true" className={`size-3 ${refreshing ? "animate-spin" : ""}`} /> <span className="hidden xl:inline">{copy.guestRefresh}</span>
          </PixelButton>
        </div>
      </PixelPanel>

      {error && <p role="alert" className="border-2 border-red bg-[#2b0810] p-2 text-sm text-[#ff9ca5] lg:col-span-3">{error}</p>}
    </section>
  );
}
