"use client";

import Link from "next/link";
import { useI18n } from "@/components/i18n-provider";

export function Brand({ compact = false }: { compact?: boolean }) {
  const { copy } = useI18n();
  return (
    <Link
      href="/"
      className="group inline-flex min-h-12 items-center gap-3"
      aria-label={copy.brandHome}
    >
      <span
        aria-hidden="true"
        className="grid size-10 grid-cols-3 grid-rows-3 border-2 border-primary bg-[#03140b] p-1 shadow-[3px_3px_0_#155d3a]"
      >
        <i className="col-start-1 row-start-1 bg-primary" />
        <i className="col-start-3 row-start-1 bg-primary" />
        <i className="col-start-2 row-start-2 bg-yellow" />
        <i className="col-span-3 row-start-3 bg-primary" />
      </span>
      {!compact && (
        <span className="hidden sm:block">
          <span className="block font-pixel text-[12px] leading-relaxed tracking-[0.07em] text-primary neon-green sm:text-sm">
            VMT SHOP
          </span>
          <span className="block text-[15px] leading-none tracking-[0.18em] text-muted">
            {copy.brandTagline}
          </span>
        </span>
      )}
    </Link>
  );
}
