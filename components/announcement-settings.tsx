"use client";

import { useMemo, useState } from "react";
import { BellRing, Check, ExternalLink, Gift, Info, Link2, Megaphone, Save, ShieldCheck } from "lucide-react";
import { PixelButton } from "@/components/ui/pixel-button";
import { PixelInput, PixelTextarea } from "@/components/ui/pixel-input";
import { useI18n } from "@/components/i18n-provider";
import type { AnnouncementConfig } from "@/lib/announcement";

const iconOptions = [
  { value: "megaphone", Icon: Megaphone },
  { value: "info", Icon: Info },
  { value: "gift", Icon: Gift },
  { value: "shield", Icon: ShieldCheck },
  { value: "link", Icon: Link2 },
] as const;

function safeLink(value: string) {
  if (!value) return true;
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try { return ["http:", "https:"].includes(new URL(value).protocol); } catch { return false; }
}

export function AnnouncementSettings({ initialConfig }: { initialConfig: AnnouncementConfig }) {
  const { copy } = useI18n();
  const [config, setConfig] = useState(initialConfig);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ text: string; error: boolean } | null>(null);
  const Icon = iconOptions.find((item) => item.value === config.icon)?.Icon ?? BellRing;
  const valid = useMemo(() => {
    const contentValid = config.vi.title.trim() && config.vi.message.trim() && config.en.title.trim() && config.en.message.trim();
    const labelsValid = !config.linkUrl.trim() || (config.vi.linkLabel.trim() && config.en.linkLabel.trim());
    return Boolean(contentValid && labelsValid && safeLink(config.linkUrl.trim()));
  }, [config]);

  function updateLocale(locale: "vi" | "en", field: "title" | "message" | "linkLabel", value: string) {
    setConfig((current) => ({ ...current, [locale]: { ...current[locale], [field]: value } }));
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!valid) return;
    setBusy(true);
    setNotice(null);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ announcement: { ...config, linkUrl: config.linkUrl.trim() } }),
      });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error || copy.announcementSaveFailed);
      setNotice({ text: copy.announcementSaved, error: false });
    } catch (cause) {
      setNotice({ text: cause instanceof Error ? cause.message : copy.announcementSaveFailed, error: true });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={save} className="space-y-6" noValidate>
      <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
        <label className="flex min-h-14 cursor-pointer items-center gap-3 border-2 border-border bg-[#071126] p-4 hover:border-primary">
          <input type="checkbox" checked={config.enabled} onChange={(event) => setConfig((current) => ({ ...current, enabled: event.target.checked }))} className="size-5 accent-[#39ff88]" />
          <span><span className="block font-pixel text-[9px] leading-relaxed">{copy.announcementEnabled}</span><span className="block text-lg text-muted">{copy.announcementEnabledHelp}</span></span>
        </label>
        <div>
          <label htmlFor="announcement-icon" className="mb-2 block font-pixel text-[8px] leading-relaxed">{copy.announcementIconLabel}</label>
          <div className="flex gap-3">
            <span className="grid size-12 shrink-0 place-items-center border-2 border-yellow bg-[#2a2105] text-yellow"><Icon aria-hidden="true" className="size-5" /></span>
            <select id="announcement-icon" value={config.icon} onChange={(event) => setConfig((current) => ({ ...current, icon: event.target.value as AnnouncementConfig["icon"] }))} className="min-h-12 w-full border-[3px] border-border bg-[#030815] px-4 text-xl text-foreground hover:border-[#466795] focus:border-primary focus:outline-none">
              {iconOptions.map((item) => <option key={item.value} value={item.value}>{copy[`announcementIcon_${item.value}`]}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {(["vi", "en"] as const).map((locale) => (
          <fieldset key={locale} className="space-y-4 border-2 border-border bg-[#071126] p-4 sm:p-5">
            <legend className="px-2 font-pixel text-[9px] text-blue">{locale === "vi" ? copy.announcementVietnamese : copy.announcementEnglish}</legend>
            <div><label htmlFor={`announcement-title-${locale}`} className="mb-2 block font-pixel text-[8px]">{copy.announcementTitleLabel}</label><PixelInput id={`announcement-title-${locale}`} maxLength={100} value={config[locale].title} onChange={(event) => updateLocale(locale, "title", event.target.value)} required /></div>
            <div><label htmlFor={`announcement-message-${locale}`} className="mb-2 block font-pixel text-[8px]">{copy.announcementMessageLabel}</label><PixelTextarea id={`announcement-message-${locale}`} rows={5} maxLength={1200} value={config[locale].message} onChange={(event) => updateLocale(locale, "message", event.target.value)} required /><p className="mt-1 text-right text-base text-muted tabular-nums">{config[locale].message.length}/1200</p></div>
            <div><label htmlFor={`announcement-link-label-${locale}`} className="mb-2 block font-pixel text-[8px]">{copy.announcementLinkLabel}</label><PixelInput id={`announcement-link-label-${locale}`} maxLength={80} value={config[locale].linkLabel} onChange={(event) => updateLocale(locale, "linkLabel", event.target.value)} /></div>
          </fieldset>
        ))}
      </div>

      <fieldset className="space-y-4 border-2 border-border p-4 sm:p-5">
        <legend className="px-2 font-pixel text-[9px] text-yellow">{copy.announcementLinkSection}</legend>
        <div><label htmlFor="announcement-link-url" className="mb-2 block font-pixel text-[8px]">{copy.announcementLinkUrl}</label><PixelInput id="announcement-link-url" type="url" maxLength={2048} value={config.linkUrl} onChange={(event) => setConfig((current) => ({ ...current, linkUrl: event.target.value }))} placeholder="/receive hoặc https://example.com" aria-invalid={!safeLink(config.linkUrl.trim())} aria-describedby="announcement-link-help" /><p id="announcement-link-help" className={`mt-2 text-lg ${safeLink(config.linkUrl.trim()) ? "text-muted" : "text-red"}`}>{safeLink(config.linkUrl.trim()) ? copy.announcementLinkHelp : copy.announcementLinkInvalid}</p></div>
        <label className="flex min-h-12 cursor-pointer items-center gap-3 text-lg text-muted"><input type="checkbox" checked={config.openInNewTab} onChange={(event) => setConfig((current) => ({ ...current, openInNewTab: event.target.checked }))} className="size-5 accent-[#ffd83d]" /><ExternalLink aria-hidden="true" className="size-5 text-yellow" /> {copy.announcementNewTab}</label>
      </fieldset>

      {!valid && <p role="alert" className="border-2 border-red bg-[#2b0810] p-3 text-[#ffabb3]">{copy.announcementInvalid}</p>}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <PixelButton type="submit" disabled={busy || !valid}><Save aria-hidden="true" className="size-4" /> {busy ? copy.announcementSaving : copy.announcementSave}</PixelButton>
        <p className="text-lg text-muted">{copy.announcementStorageHelp}</p>
      </div>
      {notice && <p role={notice.error ? "alert" : "status"} aria-live="polite" className={`flex items-center gap-2 border-2 p-3 ${notice.error ? "border-red bg-[#2b0810] text-[#ffabb3]" : "border-primary bg-[#062116] text-primary"}`}><Check aria-hidden="true" className="size-5" /> {notice.text}</p>}
    </form>
  );
}
