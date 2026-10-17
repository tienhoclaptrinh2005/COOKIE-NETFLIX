"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/pixel-button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useI18n } from "@/components/i18n-provider";

export default function NotFound() {
  const { copy } = useI18n();
  return (
    <main id="main-content" className="grid min-h-dvh place-items-center px-4">
      <div className="pixel-shadow max-w-xl border-[3px] border-red bg-surface p-8 text-center">
        <p className="font-pixel text-6xl text-red">404</p>
        <h1 className="mt-6 font-pixel text-sm leading-relaxed">{copy.notFoundTitle}</h1>
        <p className="my-6 text-2xl text-muted">{copy.notFoundBody}</p>
        <div className="flex flex-col items-center gap-4"><Link href="/" className={buttonVariants({ variant: "primary" })}>{copy.returnHome}</Link><LanguageSwitcher /></div>
      </div>
    </main>
  );
}
