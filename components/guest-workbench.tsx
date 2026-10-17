"use client";

import { useState } from "react";
import { AlertOctagon, BadgeCheck, CheckCircle2, CircleHelp, Copy, CreditCard, Eraser, ExternalLink, Globe2, KeyRound, Languages, Phone, Play, Radar, ShieldCheck, Tv, UserRound } from "lucide-react";
import { PixelButton, buttonVariants } from "@/components/ui/pixel-button";
import { PixelPanel } from "@/components/ui/pixel-panel";
import { PixelTextarea } from "@/components/ui/pixel-input";
import { StatusBadge } from "@/components/ui/status-badge";
import { useI18n } from "@/components/i18n-provider";
import { formatMessage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type CheckMode = "fullinfo" | "tokenonly" | "infoonly";

type CheckResult = {
  status: "LIVE" | "DIE" | "UNKNOWN";
  message: string;
  mode: CheckMode;
  accountInfo?: {
    country: string;
    language: string;
    phone: string;
    paymentHold: string;
    hasAds: string;
    hasService: string;
  };
  directLoginUrl?: string;
  reference: string;
  checkedAt: string;
  remaining: number | null;
};

function ResultDisplay({ result }: { result: CheckResult | null }) {
  const { copy } = useI18n();
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  async function copyDirectLogin() {
    if (!result?.directLoginUrl) return;
    try {
      await navigator.clipboard.writeText(result.directLoginUrl);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 2200);
    } catch {
      setCopyState("error");
    }
  }

  if (!result) {
    return (
      <div className="flex min-h-48 flex-col items-center justify-center border-2 border-dashed border-border bg-[#050c1d] p-6 text-center">
        <Radar aria-hidden="true" className="mb-4 size-10 text-[#476187]" strokeWidth={1.5} />
        <p className="font-pixel text-[10px] leading-relaxed text-muted">{copy.guestAwaiting}</p>
        <p className="mt-2 max-w-lg text-lg text-[#7185a7]">{copy.guestAwaitingDetail}</p>
      </div>
    );
  }

  const config = {
    LIVE: { Icon: CheckCircle2, border: "border-primary", text: "text-primary", bg: "bg-[#052719]", tone: "live" as const },
    DIE: { Icon: AlertOctagon, border: "border-red", text: "text-[#ff7583]", bg: "bg-[#2c0810]", tone: "die" as const },
    UNKNOWN: { Icon: CircleHelp, border: "border-yellow", text: "text-yellow", bg: "bg-[#2a2105]", tone: "unknown" as const },
  }[result.status];
  const Icon = config.Icon;
  const accountRows = result.accountInfo ? [
    { icon: Globe2, label: copy.guestCountry, value: result.accountInfo.country },
    { icon: Languages, label: copy.guestLanguage, value: result.accountInfo.language },
    { icon: Phone, label: copy.guestPhone, value: result.accountInfo.phone },
    { icon: CreditCard, label: copy.guestPaymentHold, value: result.accountInfo.paymentHold },
    { icon: BadgeCheck, label: copy.guestHasAds, value: result.accountInfo.hasAds },
    { icon: Tv, label: copy.guestWatchService, value: result.accountInfo.hasService },
  ] : [];

  return (
    <div className="space-y-4">
      <div className={`min-h-48 border-[3px] ${config.border} ${config.bg} p-5 sm:p-6`}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start" role="status" aria-live="polite">
        <div className={`grid size-16 shrink-0 place-items-center border-[3px] ${config.border} bg-[#020713]`}>
          <Icon aria-hidden="true" className={`size-9 ${config.text}`} strokeWidth={2.5} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className={`font-pixel text-base leading-relaxed ${config.text}`}>{result.status}</h3>
            <StatusBadge tone={config.tone}>{copy.guestAnalysisComplete}</StatusBadge>
          </div>
          <p className="mt-3 text-xl text-foreground">{result.message}</p>
          <dl className="mt-5 grid gap-3 border-t-2 border-white/10 pt-4 text-lg sm:grid-cols-2">
            <div><dt className="text-muted">{copy.guestReference}</dt><dd className="font-pixel text-[9px] leading-relaxed text-foreground">{result.reference}</dd></div>
            <div><dt className="text-muted">{copy.guestChecked}</dt><dd className="text-foreground">{new Date(result.checkedAt).toLocaleTimeString()}</dd></div>
          </dl>
        </div>
      </div>
      </div>

      {result.status === "LIVE" && result.accountInfo && (
        <section className="border-[3px] border-blue bg-[#071126] p-4 sm:p-5" aria-labelledby="account-result-title">
          <div className="mb-4 flex items-center gap-3 border-b-2 border-blue/30 pb-4">
            <UserRound aria-hidden="true" className="size-6 text-blue" />
            <h4 id="account-result-title" className="font-pixel text-[11px] uppercase leading-relaxed text-foreground">{copy.guestAccount}</h4>
          </div>
          <dl className="grid gap-3">
            {accountRows.map(({ icon: RowIcon, label, value }) => (
              <div key={label} className="grid min-h-12 gap-2 border-l-[3px] border-primary bg-[#0b1830] px-4 py-3 sm:grid-cols-[minmax(130px,.7fr)_minmax(0,1.3fr)] sm:items-center">
                <dt className="flex items-center gap-2 text-base text-[#91abd0]">
                  <RowIcon aria-hidden="true" className="size-4 shrink-0 text-blue" />
                  {label}
                </dt>
                <dd className="min-w-0 [overflow-wrap:anywhere] text-base font-bold text-foreground sm:text-right">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {result.status === "LIVE" && result.directLoginUrl && (
        <section className="border-[3px] border-yellow bg-[#171304] p-4 sm:p-5" aria-labelledby="direct-login-title">
          <div className="mb-4 flex items-center gap-3 border-b-2 border-yellow/30 pb-4">
            <KeyRound aria-hidden="true" className="size-6 text-yellow" />
            <h4 id="direct-login-title" className="font-pixel text-[11px] uppercase leading-relaxed text-yellow">{copy.guestDirectLogin}</h4>
          </div>
          <pre className="max-h-44 overflow-y-auto whitespace-pre-wrap border-2 border-border bg-[#020713] p-4 font-mono text-sm leading-relaxed text-[#b9d9ff] [overflow-wrap:anywhere]">{result.directLoginUrl}</pre>
          <p className="mt-3 text-base leading-snug text-[#f2d982]">{copy.guestTokenWarning}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <PixelButton variant="yellow" size="sm" onClick={() => void copyDirectLogin()}>
              <Copy aria-hidden="true" className="size-4" />
              {copyState === "copied" ? copy.guestCopied : copy.guestCopyLink}
            </PixelButton>
            <a
              href={result.directLoginUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "w-full")}
            >
              <ExternalLink aria-hidden="true" className="size-4" /> {copy.guestOpenLink}
            </a>
          </div>
          <p className="sr-only" aria-live="polite">
            {copyState === "copied" ? copy.guestCopySuccess : copyState === "error" ? copy.guestCopyFailed : ""}
          </p>
          {copyState === "error" && <p role="alert" className="mt-3 text-base text-[#ff9ca5]">{copy.guestCopyFailed}</p>}
        </section>
      )}
    </div>
  );
}

export function GuestWorkbench() {
  const { copy } = useI18n();
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<CheckMode>("fullinfo");
  const [result, setResult] = useState<CheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (input.trim().length < 16) {
      setError(copy.guestInputTooShort);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cookieData: input, mode }),
      });
      const data = await response.json() as CheckResult & { error?: string };
      if (!response.ok) throw new Error(data.error || copy.guestAnalysisFailed);
      setResult(data);
      setInput("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : copy.guestAnalysisRetry);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-2">
        <PixelPanel title={copy.guestAnalyzerTitle} eyebrow={copy.guestAnalyzerEyebrow} accent="green" className="h-full min-w-0">
          <form onSubmit={handleSubmit} className="p-4 sm:p-6" noValidate>
            <div className="mb-5 flex items-start gap-3 border-2 border-[#254673] bg-[#08192f] p-4 text-[#c0d9f8]">
              <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-blue" />
              <p className="text-lg leading-snug">{copy.guestPrivacyNotice}</p>
            </div>
            <label htmlFor="cookie-data" className="mb-2 block font-pixel text-[9px] uppercase leading-relaxed text-foreground">
              {copy.guestCookieLabel} <span className="text-red">*</span>
            </label>
            <PixelTextarea
              id="cookie-data"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              rows={8}
              minLength={16}
              maxLength={16_000}
              autoComplete="off"
              spellCheck={false}
              disabled={loading}
              aria-describedby="cookie-help input-error"
              aria-invalid={Boolean(error)}
              placeholder="NetflixId=••••••; SecureNetflixId=••••••"
            />
            <div className="mt-2 flex flex-wrap justify-between gap-2 text-base text-muted">
              <p id="cookie-help">{copy.guestCookieHelp}</p>
              <p aria-label={formatMessage(copy.guestCharCount, { count: input.length })}>{input.length}/16000</p>
            </div>
            <fieldset className="mt-5" disabled={loading}>
              <legend className="mb-2 font-pixel text-[9px] uppercase leading-relaxed text-foreground">{copy.guestModeLabel}</legend>
              <div className="grid gap-2 sm:grid-cols-3" role="radiogroup" aria-label={copy.guestModeLabel}>
                {([
                  ["fullinfo", copy.guestModeFull],
                  ["tokenonly", copy.guestModeToken],
                  ["infoonly", copy.guestModeInfo],
                ] as const).map(([value, label]) => {
                  const active = mode === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setMode(value)}
                      className={cn(
                        "min-h-12 cursor-pointer border-[3px] px-3 py-3 font-pixel text-[9px] uppercase leading-relaxed transition-[color,background-color,border-color,box-shadow,transform] duration-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue/40 disabled:pointer-events-none disabled:opacity-40 active:translate-y-0.5",
                        active
                          ? "border-[#b8ffd2] bg-primary text-[#02130a] shadow-[3px_3px_0_#167b45]"
                          : "border-border bg-[#050c1d] text-[#9ab2d4] hover:border-blue hover:text-blue",
                      )}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-base leading-snug text-muted">{copy.guestModeHelp}</p>
            </fieldset>
            {error && (
              <div id="input-error" role="alert" className="mt-4 flex items-start gap-3 border-2 border-red bg-[#2b0810] p-3 text-[#ff9ca5]">
                <AlertOctagon aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
                <p className="leading-snug">{error}</p>
              </div>
            )}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <PixelButton type="submit" size="lg" disabled={loading || !input.trim()} className="flex-1">
                {loading ? <><span className="pixel-loader mr-7" aria-hidden="true" /> {copy.guestAnalyzing}</> : <><Play aria-hidden="true" className="size-4 fill-current" /> {copy.guestStart}</>}
              </PixelButton>
              <PixelButton variant="ghost" size="lg" disabled={loading || (!input && !result)} onClick={() => { setInput(""); setResult(null); setError(""); }} aria-label={copy.guestClearAria}>
                <Eraser aria-hidden="true" className="size-4" /> {copy.guestClear}
              </PixelButton>
            </div>
          </form>
        </PixelPanel>
        <PixelPanel title={copy.guestResultTitle} eyebrow={copy.guestResultEyebrow} accent={result?.status === "LIVE" ? "green" : result?.status === "DIE" ? "red" : "yellow"} className="h-full min-w-0">
          <div className="p-4 sm:p-6 lg:min-h-[640px]"><ResultDisplay result={result} /></div>
        </PixelPanel>
    </div>
  );
}
