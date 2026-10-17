"use client";

import { useEffect, useState } from "react";
import { AlertOctagon, CheckCircle2, Copy, ExternalLink, Gift, Info, KeyRound, Layers3, ShieldCheck } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { PixelButton, buttonVariants } from "@/components/ui/pixel-button";
import { PixelInput } from "@/components/ui/pixel-input";
import { PixelPanel } from "@/components/ui/pixel-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatMessage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type UserStatus = { role: "admin" | "guest" };

type ReceiveResult = {
  role: "admin" | "guest";
  requested: number;
  delivered: number;
  items: Array<{ directLoginUrl: string; reference: string }>;
  remaining: number | null;
  checkedAt: string;
  message: string;
};

export function ReceiveWorkbench() {
  const { copy } = useI18n();
  const [role, setRole] = useState<"admin" | "guest" | null>(null);
  const [quantity, setQuantity] = useState("1");
  const [result, setResult] = useState<ReceiveResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<number | "all" | null>(null);
  const numericQuantity = Number(quantity);
  const validQuantity = Number.isInteger(numericQuantity) && numericQuantity >= 1 && numericQuantity <= 20;

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/status", { cache: "no-store", signal: controller.signal })
      .then((response) => response.ok ? response.json() as Promise<UserStatus> : Promise.reject())
      .then((data) => setRole(data.role))
      .catch((cause: unknown) => {
        if (cause instanceof DOMException && cause.name === "AbortError") return;
        setRole("guest");
      });
    return () => controller.abort();
  }, []);

  async function receive(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const requested = role === "admin" ? numericQuantity : 1;
    if (!Number.isInteger(requested) || requested < 1 || requested > 20) return;
    setLoading(true);
    setError("");
    setCopied(null);
    try {
      const response = await fetch("/api/receive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: requested }),
      });
      const data = await response.json() as ReceiveResult & { error?: string };
      if (!response.ok) throw new Error(data.error || copy.apiReceiveFailed);
      setResult(data);
      window.dispatchEvent(new Event("pixel-press:status-refresh"));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : copy.apiReceiveFailed);
    } finally {
      setLoading(false);
    }
  }

  async function copyLink(index: number) {
    const link = result?.items[index]?.directLoginUrl;
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(index);
      window.setTimeout(() => setCopied(null), 2200);
    } catch {
      setError(copy.guestCopyFailed);
    }
  }

  async function copyAll() {
    if (!result?.items.length) return;
    try {
      await navigator.clipboard.writeText(result.items.map((item) => item.directLoginUrl).join("\n"));
      setCopied("all");
      window.setTimeout(() => setCopied(null), 2200);
    } catch {
      setError(copy.guestCopyFailed);
    }
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,.78fr)_minmax(0,1.22fr)]">
      <PixelPanel title={copy.receivePanelTitle} eyebrow={copy.receivePanelEyebrow} accent="green" className="min-w-0">
        <form onSubmit={receive} className="space-y-5 p-4 sm:p-6" noValidate>
          <div className="border-2 border-blue bg-[#08192f] p-4 text-[#c0d9f8]">
            <div className="flex items-center gap-3">
              <Info aria-hidden="true" className="size-5 shrink-0 text-blue" />
              <h3 className="font-pixel text-[9px] uppercase leading-relaxed text-foreground">{copy.receiveHowTitle}</h3>
            </div>
            <p className="mt-3 text-lg leading-snug">{copy.receiveHowBody}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <div className="border-2 border-border bg-[#071126] p-4">
              <ShieldCheck aria-hidden="true" className="mb-3 size-5 text-primary" />
              <p className="font-pixel text-[8px] leading-relaxed text-primary">{copy.guestRoleGuest}</p>
              <p className="mt-2 text-lg leading-snug text-muted">{copy.receiveGuestRule}</p>
            </div>
            <div className="border-2 border-border bg-[#071126] p-4">
              <Layers3 aria-hidden="true" className="mb-3 size-5 text-yellow" />
              <p className="font-pixel text-[8px] leading-relaxed text-yellow">{copy.guestRoleAdmin}</p>
              <p className="mt-2 text-lg leading-snug text-muted">{copy.receiveAdminRule}</p>
            </div>
          </div>

          {role === "admin" ? (
            <div>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                <label htmlFor="receive-quantity" className="font-pixel text-[9px] uppercase leading-relaxed text-foreground">{copy.receiveQuantity}</label>
                <StatusBadge tone="info">{copy.receiveAdminBatch}</StatusBadge>
              </div>
              <PixelInput
                id="receive-quantity"
                type="number"
                inputMode="numeric"
                min={1}
                max={20}
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                disabled={loading}
                aria-invalid={!validQuantity}
                aria-describedby="receive-quantity-help"
              />
              <p id="receive-quantity-help" className={`mt-2 text-base ${validQuantity ? "text-muted" : "text-red"}`}>{copy.receiveQuantityHelp}</p>
            </div>
          ) : (
            <div className="flex items-center gap-3 border-2 border-yellow bg-[#2a2105] p-4 text-yellow">
              <Gift aria-hidden="true" className="size-5 shrink-0" />
              <p className="text-lg leading-snug">{copy.receiveGuestSingle}</p>
            </div>
          )}

          {error && (
            <div role="alert" className="flex items-start gap-3 border-2 border-red bg-[#2b0810] p-3 text-[#ff9ca5]">
              <AlertOctagon aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
              <p className="text-lg leading-snug">{error}</p>
            </div>
          )}

          <PixelButton type="submit" size="lg" disabled={loading || role === null || (role === "admin" && !validQuantity)} className="w-full">
            {loading ? <><span className="pixel-loader mr-7" aria-hidden="true" /> {copy.receiveLoading}</> : <><Gift aria-hidden="true" className="size-5" /> {role === "admin" && numericQuantity > 1 ? copy.receiveButtonMany : copy.receiveButton}</>}
          </PixelButton>
        </form>
      </PixelPanel>

      <PixelPanel title={copy.receiveResultTitle} eyebrow={copy.receiveResultEyebrow} accent={result ? "green" : "yellow"} className="min-w-0">
        <div className="p-4 sm:p-6">
          {!result ? (
            <div className="grid min-h-[420px] place-items-center border-2 border-dashed border-border bg-[#050c1d] p-6 text-center">
              <div>
                <KeyRound aria-hidden="true" className="mx-auto mb-4 size-10 text-[#476187]" strokeWidth={1.5} />
                <p className="font-pixel text-[10px] leading-relaxed text-muted">{copy.receiveEmpty}</p>
                <p className="mx-auto mt-3 max-w-xl text-lg leading-snug text-[#7185a7]">{copy.receiveEmptyDetail}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col gap-4 border-[3px] border-primary bg-[#052719] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <CheckCircle2 aria-hidden="true" className="mt-0.5 size-7 shrink-0 text-primary" />
                  <div>
                    <p className="font-pixel text-[10px] leading-relaxed text-primary">{result.message}</p>
                    <p className="mt-2 text-lg text-[#c5f7d7]">{formatMessage(copy.receiveSummary, { delivered: result.delivered, requested: result.requested })}</p>
                  </div>
                </div>
                {result.items.length > 1 && (
                  <PixelButton variant="yellow" size="sm" onClick={() => void copyAll()}>
                    <Copy aria-hidden="true" className="size-4" /> {copied === "all" ? copy.receiveCopiedAll : copy.receiveCopyAll}
                  </PixelButton>
                )}
              </div>

              {result.items.map((item, index) => (
                <article key={item.reference} className="border-[3px] border-blue bg-[#071126] p-4 sm:p-5">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b-2 border-blue/30 pb-3">
                    <div className="flex items-center gap-3">
                      <KeyRound aria-hidden="true" className="size-5 text-yellow" />
                      <h3 className="font-pixel text-[9px] leading-relaxed text-foreground">{formatMessage(copy.receiveTokenItem, { index: index + 1 })}</h3>
                    </div>
                    <code className="text-sm text-muted">{item.reference}</code>
                  </div>
                  <pre className="max-h-36 overflow-y-auto whitespace-pre-wrap border-2 border-border bg-[#020713] p-4 font-mono text-sm leading-relaxed text-[#b9d9ff] [overflow-wrap:anywhere]">{item.directLoginUrl}</pre>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <PixelButton variant="yellow" size="sm" onClick={() => void copyLink(index)}>
                      <Copy aria-hidden="true" className="size-4" /> {copied === index ? copy.guestCopied : copy.guestCopyLink}
                    </PixelButton>
                    <a href={item.directLoginUrl} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "w-full")}>
                      <ExternalLink aria-hidden="true" className="size-4" /> {copy.guestOpenLink}
                    </a>
                  </div>
                </article>
              ))}
              <p className="border-2 border-yellow bg-[#2a2105] p-3 text-base leading-snug text-yellow">{copy.guestTokenWarning}</p>
            </div>
          )}
        </div>
      </PixelPanel>
    </div>
  );
}
