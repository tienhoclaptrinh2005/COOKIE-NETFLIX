import { LayoutDashboard, LockKeyhole, Radio } from "lucide-react";
import Link from "next/link";
import { Brand } from "@/components/brand";
import { LanguageSwitcher } from "@/components/language-switcher";
import { PublicNav } from "@/components/public-nav";
import { getAdminSession } from "@/lib/auth";
import { getServerDictionary } from "@/lib/i18n-server";

export async function SiteHeader() {
  const [copy, session] = await Promise.all([getServerDictionary(), getAdminSession()]);
  return (
    <header className="border-b-[3px] border-border bg-[#030815]/95">
      <div className="mx-auto flex min-h-20 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <Brand />
        <nav aria-label="Primary navigation" className="flex items-center gap-2 sm:gap-4">
          <span className="hidden items-center gap-2 font-pixel text-[8px] text-primary sm:flex">
            <Radio aria-hidden="true" className="size-4 status-pulse" /> {copy.systemOnline}
          </span>
          <PublicNav />
          <LanguageSwitcher compact />
          <Link href={session ? "/admin" : "/login"} aria-label={copy.admin} className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 border-2 border-border bg-surface px-2 font-pixel text-[8px] uppercase text-muted transition-colors hover:border-yellow hover:text-yellow sm:px-3 lg:px-4">
            {session ? <LayoutDashboard aria-hidden="true" className="size-4" strokeWidth={2.5} /> : <LockKeyhole aria-hidden="true" className="size-4" strokeWidth={2.5} />}
            <span className="hidden sm:inline">{copy.admin}</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
