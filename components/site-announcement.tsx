"use client";

import { useEffect, useRef } from "react";
import { BellRing, Gift, Info, Link2, Megaphone, ShieldCheck, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { PixelButton, buttonVariants } from "@/components/ui/pixel-button";
import { useI18n } from "@/components/i18n-provider";
import type { AnnouncementConfig } from "@/lib/announcement";
import { cn } from "@/lib/utils";

const icons = {
  megaphone: Megaphone,
  info: Info,
  gift: Gift,
  shield: ShieldCheck,
  link: Link2,
};

export function SiteAnnouncement({ config }: { config: AnnouncementConfig }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
  const { locale, copy } = useI18n();
  const content = config[locale];
  const Icon = icons[config.icon] ?? BellRing;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || pathname.startsWith("/admin")) return;
    if (!dialog.open) dialog.showModal();
  }, [pathname]);

  function close() {
    dialogRef.current?.close();
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="site-announcement-title"
      aria-describedby="site-announcement-message"
      onClick={(event) => { if (event.target === event.currentTarget) close(); }}
      className="announcement-dialog m-auto w-[calc(100%_-_2rem)] max-w-2xl border-[3px] border-yellow bg-surface p-0 text-foreground shadow-[10px_10px_0_#000510] backdrop:bg-[#01040d]/90"
    >
      <div className="pixel-grid border-b-[3px] border-border bg-[#071126] px-4 py-4 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-12 shrink-0 place-items-center border-2 border-yellow bg-[#2a2105] text-yellow">
              <Icon aria-hidden="true" className="size-6" strokeWidth={2.5} />
            </span>
            <div className="min-w-0">
              <p className="mb-1 font-pixel text-[8px] uppercase tracking-[0.16em] text-yellow">{copy.announcementEyebrow}</p>
              <h2 id="site-announcement-title" className="font-pixel text-[11px] uppercase leading-relaxed sm:text-sm">{content.title}</h2>
            </div>
          </div>
          <button type="button" onClick={close} className="grid size-12 shrink-0 cursor-pointer place-items-center border-2 border-border text-muted transition-colors hover:border-red hover:bg-[#2b0810] hover:text-[#ffabb3]" aria-label={copy.announcementClose}>
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <p id="site-announcement-message" className="whitespace-pre-wrap overflow-wrap-anywhere text-xl leading-relaxed text-foreground sm:text-2xl">{content.message}</p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <PixelButton type="button" variant="ghost" onClick={close}>{copy.announcementDismiss}</PixelButton>
          {config.linkUrl && content.linkLabel && (
            <a
              href={config.linkUrl}
              target={config.openInNewTab ? "_blank" : undefined}
              rel={config.openInNewTab ? "noopener noreferrer" : undefined}
              onClick={close}
              className={cn(buttonVariants({ variant: "yellow" }), "text-center")}
            >
              <Link2 aria-hidden="true" className="size-4" /> {content.linkLabel}
            </a>
          )}
        </div>
      </div>
    </dialog>
  );
}
