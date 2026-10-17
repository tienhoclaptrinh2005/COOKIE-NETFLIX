import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type PixelPanelProps = HTMLAttributes<HTMLElement> & {
  title?: string;
  eyebrow?: string;
  action?: ReactNode;
  accent?: "green" | "blue" | "yellow" | "red" | "violet";
  as?: "section" | "div" | "article";
};

const accents = {
  green: "border-primary",
  blue: "border-blue",
  yellow: "border-yellow",
  red: "border-red",
  violet: "border-violet",
};

export function PixelPanel({
  title,
  eyebrow,
  action,
  accent = "blue",
  as: Tag = "section",
  className,
  children,
  ...props
}: PixelPanelProps) {
  return (
    <Tag
      className={cn("pixel-shadow relative border-[3px] bg-surface", accents[accent], className)}
      {...props}
    >
      {(title || action) && (
        <div className="flex min-h-14 items-center justify-between gap-4 border-b-[3px] border-border bg-[#071126] px-4 py-3 sm:px-5">
          <div className="min-w-0">
            {eyebrow && <p className="mb-1 font-pixel text-[8px] uppercase tracking-[0.16em] text-muted">{eyebrow}</p>}
            {title && <h2 className="font-pixel text-[11px] uppercase leading-relaxed text-foreground sm:text-xs">{title}</h2>}
          </div>
          {action}
        </div>
      )}
      {children}
    </Tag>
  );
}
