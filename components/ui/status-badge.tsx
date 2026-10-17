import { AlertTriangle, Check, CircleHelp, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatusTone = "live" | "die" | "unknown" | "warning" | "info";

const config = {
  live: { icon: Check, classes: "border-primary bg-[#072417] text-primary" },
  die: { icon: ShieldAlert, classes: "border-red bg-[#2a0910] text-[#ff8a95]" },
  unknown: { icon: CircleHelp, classes: "border-yellow bg-[#2a2105] text-yellow" },
  warning: { icon: AlertTriangle, classes: "border-yellow bg-[#2a2105] text-yellow" },
  info: { icon: CircleHelp, classes: "border-blue bg-[#08213a] text-[#7bc4ff]" },
};

export function StatusBadge({ tone, children, className }: { tone: StatusTone; children: React.ReactNode; className?: string }) {
  const Icon = config[tone].icon;
  return (
    <span className={cn("inline-flex min-h-8 items-center gap-2 border-2 px-2.5 py-1 font-pixel text-[8px] uppercase leading-relaxed", config[tone].classes, className)}>
      <Icon aria-hidden="true" className="size-3.5" strokeWidth={3} />
      {children}
    </span>
  );
}
