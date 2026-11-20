"use client";

import { useCallback, useEffect, useState } from "react";
import { Gauge } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { PixelPanel } from "@/components/ui/pixel-panel";
import { PixelProgress } from "@/components/ui/pixel-progress";

type PublicStatus = {
  quota: { limit: number; used: number; remaining: number; unlimited?: boolean };
};

function StatusSkeleton() {
  const { copy } = useI18n();
  return <div className="h-12 animate-pulse border-2 border-border bg-[#071126]" aria-label={copy.guestStatusLoading} />;
}

export function GuestStatusStrip() {
  const { copy } = useI18n();
  const [status, setStatus] = useState<PublicStatus | null>(null);
  const [error, setError] = useState("");

  const loadStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/status", { cache: "no-store" });
      if (!response.ok) throw new Error(copy.guestStatusUnavailable);
      setStatus((await response.json()) as PublicStatus);
      setError("");
    } catch {
      setError(copy.guestConnectionError);
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

  return (
    <section className="w-full min-w-0 lg:max-w-xl lg:justify-self-end" aria-label={copy.guestDailyCredits}>
      <PixelPanel compact title={copy.guestDailyCredits} eyebrow={copy.guestResetTime} accent="yellow">
        <div className="p-3">
          {!status ? <StatusSkeleton /> : status.quota.unlimited ? (
            <div className="flex min-h-14 items-center justify-center gap-4 text-center">
              <p className="font-pixel text-2xl text-yellow neon-blue">∞</p><p className="text-base text-muted">{copy.guestAdminUnlimited}</p>
            </div>
          ) : (
            <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4">
              <div className="flex items-baseline gap-2.5">
                <p className="font-pixel text-[7px] uppercase text-muted">{copy.guestRemaining}</p>
                <p className="font-pixel text-2xl text-yellow">{status.quota.remaining}</p>
              </div>
              <PixelProgress className="space-y-1.5 [&>div:first-child]:text-[7px] [&>div:last-child]:h-4 [&>div:last-child]:p-[2px]" value={status.quota.used} max={status.quota.limit} label={copy.guestCreditsUsed} />
              <Gauge aria-hidden="true" className="size-7 text-yellow" strokeWidth={1.75} />
            </div>
          )}
        </div>
      </PixelPanel>
      {error && <p role="alert" className="mt-2 border-2 border-red bg-[#2b0810] p-2 text-sm text-[#ff9ca5]">{error}</p>}
    </section>
  );
}
