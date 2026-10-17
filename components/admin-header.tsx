"use client";

import { Radio, ShieldCheck } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";

export function AdminHeader({ title, description }: { title: string; description: string }) {
  const { copy } = useI18n();
  return (
    <header className="border-b-[3px] border-border bg-[#050b19] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1500px] flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><div className="mb-3 flex items-center gap-2 font-pixel text-[8px] text-primary"><ShieldCheck aria-hidden="true" className="size-4" /> {copy.adminControlCenter}</div><h1 className="font-pixel text-lg leading-relaxed text-foreground sm:text-2xl">{title}</h1><p className="mt-2 text-xl text-muted">{description}</p></div>
        <div className="inline-flex w-fit items-center gap-2 border-2 border-primary bg-[#062116] px-3 py-2 font-pixel text-[8px] text-primary"><Radio aria-hidden="true" className="size-4 status-pulse" /> {copy.adminPrivileged}</div>
      </div>
    </header>
  );
}
