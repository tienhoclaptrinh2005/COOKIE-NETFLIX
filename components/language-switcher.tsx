"use client";

import { startTransition, useState } from "react";
import { Languages } from "lucide-react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/i18n-provider";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const { locale, setLocale, copy } = useI18n();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function select(nextLocale: Locale) {
    if (nextLocale === locale) return;
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: nextLocale }),
      });
      if (!response.ok) throw new Error(copy.languageChangeFailed);
      setLocale(nextLocale);
      startTransition(() => router.refresh());
    } catch {
      setError(copy.languageChangeFailed);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="relative inline-flex">
      <div className="inline-flex min-h-11 items-stretch border-2 border-border bg-[#071126]" role="group" aria-label={copy.languageLabel} aria-busy={pending}>
      {!compact && <span className="hidden items-center border-r-2 border-border px-3 text-blue sm:inline-flex"><Languages aria-hidden="true" className="size-4" /></span>}
      {(["vi", "en"] as const).map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => void select(item)}
          disabled={pending}
          aria-pressed={locale === item}
          aria-label={item === "vi" ? copy.switchToVietnamese : copy.switchToEnglish}
          className={cn(
            "min-h-11 min-w-11 cursor-pointer px-3 font-pixel text-[8px] uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow disabled:cursor-wait disabled:opacity-60",
            locale === item ? "bg-blue text-[#020713]" : "text-muted hover:bg-surface hover:text-foreground",
          )}
        >
          {item.toUpperCase()}
        </button>
      ))}
      </div>
      {error && <p role="alert" className="absolute right-0 top-[calc(100%+4px)] z-50 w-64 border-2 border-red bg-[#2b0810] p-2 text-base text-[#ff9ca5]">{error}</p>}
    </div>
  );
}
