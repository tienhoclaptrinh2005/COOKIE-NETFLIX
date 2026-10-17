import type { LucideIcon } from "lucide-react";

const colors = { green: "border-primary text-primary", blue: "border-blue text-blue", yellow: "border-yellow text-yellow", red: "border-red text-red", violet: "border-violet text-violet" };

export function AdminStatCard({ label, value, detail, icon: Icon, tone = "blue" }: { label: string; value: string | number; detail: string; icon: LucideIcon; tone?: keyof typeof colors }) {
  return (
    <article className={`pixel-shadow-sm border-[3px] bg-surface p-5 ${colors[tone]}`}>
      <div className="flex items-start justify-between gap-4"><p className="font-pixel text-[8px] uppercase leading-relaxed text-muted">{label}</p><Icon aria-hidden="true" className="size-5" strokeWidth={2.5} /></div>
      <p className="mt-5 font-pixel text-2xl leading-relaxed text-foreground sm:text-3xl">{value}</p>
      <p className="mt-2 text-lg text-muted">{detail}</p>
    </article>
  );
}
