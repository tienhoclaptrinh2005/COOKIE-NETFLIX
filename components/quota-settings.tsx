"use client";

import { useState } from "react";
import { Check, Save } from "lucide-react";
import { PixelButton } from "@/components/ui/pixel-button";
import { PixelInput } from "@/components/ui/pixel-input";
import { useI18n } from "@/components/i18n-provider";

export function QuotaSettings({ initialLimit }: { initialLimit: number }) {
  const { copy } = useI18n();
  const [limit, setLimit] = useState(String(initialLimit));
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const numeric = Number(limit);
  const valid = Number.isInteger(numeric) && numeric >= 1 && numeric <= 100;

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!valid) return;
    setBusy(true); setNotice("");
    try {
      const response = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ dailyLimit: numeric }) });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error || copy.quotaSaveFailed);
      setNotice(copy.quotaSaved);
    } catch (cause) { setNotice(cause instanceof Error ? cause.message : copy.quotaSaveFailed); }
    finally { setBusy(false); }
  }

  return (
    <form onSubmit={save} className="space-y-5" noValidate>
      <div><label htmlFor="daily-limit" className="mb-2 block font-pixel text-[8px] leading-relaxed">{copy.quotaLabel}</label><PixelInput id="daily-limit" type="number" inputMode="numeric" min={1} max={100} value={limit} onChange={(event) => setLimit(event.target.value)} aria-invalid={!valid} aria-describedby="quota-help" className="max-w-xs" /><p id="quota-help" className={`mt-2 text-lg ${valid ? "text-muted" : "text-red"}`}>{valid ? copy.quotaValidHelp : copy.quotaInvalidHelp}</p></div>
      <PixelButton type="submit" disabled={busy || !valid}><Save aria-hidden="true" className="size-4" /> {busy ? copy.quotaSaving : copy.quotaSave}</PixelButton>
      {notice && <p role="status" aria-live="polite" className="flex items-center gap-2 border-2 border-primary bg-[#062116] p-3 text-primary"><Check aria-hidden="true" className="size-5" /> {notice}</p>}
    </form>
  );
}
