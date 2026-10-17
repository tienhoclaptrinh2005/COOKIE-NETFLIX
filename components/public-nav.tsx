"use client";

import { Gift, SearchCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/components/i18n-provider";
import { cn } from "@/lib/utils";

export function PublicNav() {
  const pathname = usePathname();
  const { copy } = useI18n();
  const links = [
    { href: "/", label: copy.navManualCheck, icon: SearchCheck, active: pathname === "/" },
    { href: "/receive", label: copy.navReceiveToken, icon: Gift, active: pathname.startsWith("/receive") },
  ];

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {links.map(({ href, label, icon: Icon, active }) => (
        <Link
          key={href}
          href={href}
          aria-current={active ? "page" : undefined}
          aria-label={label}
          className={cn(
            "inline-flex min-h-11 min-w-11 items-center justify-center gap-2 border-2 px-2 font-pixel text-[8px] uppercase transition-colors md:px-3",
            active ? "border-primary bg-[#082719] text-primary" : "border-border bg-surface text-muted hover:border-blue hover:text-blue",
          )}
        >
          <Icon aria-hidden="true" className="size-4 shrink-0" strokeWidth={2.5} />
          <span className="hidden xl:inline">{label}</span>
        </Link>
      ))}
    </div>
  );
}
