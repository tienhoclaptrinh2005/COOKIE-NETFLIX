"use client";

import { Activity, Database, Gauge, Gift, LogOut, SearchCheck, Settings, SquareTerminal } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Brand } from "@/components/brand";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useI18n } from "@/components/i18n-provider";
import { cn } from "@/lib/utils";

export function AdminNav({ username }: { username: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { copy } = useI18n();
  const items = [
    { href: "/admin", label: copy.navOverview, icon: Gauge },
    { href: "/admin/redis", label: copy.navRedis, icon: Database },
    { href: "/admin/settings", label: copy.navSettings, icon: Settings },
    { href: "/receive", label: copy.navReceiveToken, icon: Gift },
    { href: "/", label: copy.navManualCheck, icon: SearchCheck },
  ];
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }
  return (
    <aside className="border-b-[3px] border-border bg-[#030815] lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-72 lg:flex-col lg:border-b-0 lg:border-r-[3px]">
      <div className="flex min-h-20 items-center justify-between gap-3 border-b-2 border-border px-4 lg:px-6"><Brand /><LanguageSwitcher compact /></div>
      <div className="hidden border-b-2 border-border p-6 lg:block"><p className="font-pixel text-[8px] text-muted">{copy.navOperator}</p><p className="mt-2 overflow-wrap-anywhere text-2xl text-primary">{username}</p><div className="mt-3 flex items-center gap-2 text-lg text-muted"><Activity aria-hidden="true" className="size-4 text-primary status-pulse" /> {copy.navElevated}</div></div>
      <nav aria-label={copy.navAria} className="flex gap-2 overflow-x-auto p-3 lg:flex-col lg:p-4">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" || href === "/" ? pathname === href : pathname.startsWith(href);
          return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={cn("inline-flex min-h-12 shrink-0 items-center gap-3 border-2 px-4 font-pixel text-[9px] uppercase leading-relaxed transition-colors lg:w-full", active ? "border-primary bg-[#082719] text-primary" : "border-transparent text-muted hover:border-border hover:bg-surface hover:text-foreground")}><Icon aria-hidden="true" className="size-5" strokeWidth={2.5} />{label}</Link>;
        })}
      </nav>
      <div className="mt-auto hidden border-t-2 border-border p-4 lg:block">
        <button onClick={logout} className="inline-flex min-h-12 w-full cursor-pointer items-center gap-3 border-2 border-transparent px-4 font-pixel text-[9px] text-[#ff929d] hover:border-red hover:bg-[#2b0810]"><LogOut aria-hidden="true" className="size-5" /> {copy.navLogout}</button>
        <p className="mt-4 flex items-center gap-2 text-base text-[#687c9f]"><SquareTerminal aria-hidden="true" className="size-4" /> VMT SHOP  OS v1.0</p>
      </div>
    </aside>
  );
}
