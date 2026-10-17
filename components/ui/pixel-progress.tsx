import { cn } from "@/lib/utils";

export function PixelProgress({ value, max, label, className }: { value: number; max: number; label: string; className?: string }) {
  const safeMax = Math.max(1, max);
  const percent = Math.min(100, Math.max(0, (value / safeMax) * 100));
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-3 font-pixel text-[8px] uppercase leading-relaxed text-muted">
        <span>{label}</span>
        <span className="text-foreground">{value}/{max}</span>
      </div>
      <div className="h-5 border-2 border-border bg-[#030815] p-[3px]" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value}>
        <div className="h-full bg-primary transition-transform duration-300 origin-left" style={{ transform: `scaleX(${percent / 100})`, boxShadow: "0 0 10px rgb(57 255 136 / 40%)" }} />
      </div>
    </div>
  );
}
