"use client";

import { useState } from "react";
import { AlertTriangle, Eraser, RefreshCw } from "lucide-react";
import { PixelButton } from "@/components/ui/pixel-button";
import { useI18n } from "@/components/i18n-provider";
import { formatMessage } from "@/lib/i18n";

type Pattern = "han_muc_nhan:*" | "dang_nhap:that_bai:*" | "thong_ke:*";

export function RedisControls() {
  const { copy } = useI18n();
  const [busy, setBusy] = useState<Pattern | "refresh" | null>(null);
  const [notice, setNotice] = useState("");

  async function clear(pattern: Pattern) {
    if (!window.confirm(formatMessage(copy.redisConfirm, { pattern }))) return;
    setBusy(pattern);
    setNotice("");
    try {
      const response = await fetch("/api/admin/redis", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pattern }) });
      const data = await response.json() as { removed?: number; error?: string };
      if (!response.ok) throw new Error(data.error || copy.redisCleanupFailed);
      setNotice(formatMessage(copy.redisCleared, { count: data.removed ?? 0, pattern }));
      window.setTimeout(() => window.location.reload(), 700);
    } catch (cause) {
      setNotice(cause instanceof Error ? cause.message : copy.redisCleanupFailed);
      setBusy(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 border-2 border-yellow bg-[#2a2105] p-4 text-yellow"><AlertTriangle aria-hidden="true" className="mt-0.5 size-5 shrink-0" /><p>{copy.redisWarning}</p></div>
      <div className="grid gap-3 sm:grid-cols-3">
        <PixelButton variant="danger" size="sm" disabled={Boolean(busy)} onClick={() => void clear("han_muc_nhan:*")}><Eraser aria-hidden="true" className="size-4" /> {copy.redisClearQuota}</PixelButton>
        <PixelButton variant="danger" size="sm" disabled={Boolean(busy)} onClick={() => void clear("dang_nhap:that_bai:*")}><Eraser aria-hidden="true" className="size-4" /> {copy.redisClearLogin}</PixelButton>
        <PixelButton variant="ghost" size="sm" disabled={Boolean(busy)} onClick={() => { setBusy("refresh"); window.location.reload(); }}><RefreshCw aria-hidden="true" className="size-4" /> {copy.redisRefresh}</PixelButton>
      </div>
      {notice && <p role="status" aria-live="polite" className="border-2 border-border bg-[#071126] p-3 text-lg text-muted">{notice}</p>}
    </div>
  );
}
