import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type PixelPanelProps = HTMLAttributes<HTMLElement> & {
  title?: string;
  eyebrow?: string;
  action?: ReactNode;
  compact?: boolean;
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
  compact = false,
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
        <div className={cn(
          "flex items-center justify-between gap-4 border-b-[3px] border-border bg-[#071126]",
          compact ? "min-h-11 px-3 py-2" : "min-h-14 px-4 py-3 sm:px-5",
        )}>
          <div className="min-w-0">
            {eyebrow && <p className={cn(
              "font-pixel uppercase text-muted",
              compact ? "mb-0.5 text-[6px] tracking-[0.12em]" : "mb-1 text-[8px] tracking-[0.16em]",
            )}>{eyebrow}</p>}
            {title && <h2 className={cn(
              "font-pixel uppercase leading-relaxed text-foreground",
              compact ? "text-[9px] sm:text-[10px]" : "text-[11px] sm:text-xs",
            )}>{title}</h2>}
          </div>
          {action}
        </div>
      )}
      {children}
    </Tag>
  );
}
