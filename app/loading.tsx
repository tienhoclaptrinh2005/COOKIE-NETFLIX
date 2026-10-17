"use client";

import { useI18n } from "@/components/i18n-provider";

export default function Loading() {
  const { copy } = useI18n();
  return (
    <div className="grid min-h-dvh place-items-center bg-background text-primary">
      <div className="text-center"><div className="pixel-loader mx-auto mb-8" /><p className="font-pixel text-[10px]">{copy.loadingArcade}</p></div>
    </div>
  );
}
