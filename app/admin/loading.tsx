"use client";

import { useI18n } from "@/components/i18n-provider";

export default function AdminLoading() {
  const { copy } = useI18n();
  return <div className="grid min-h-[60dvh] place-items-center text-primary"><div className="text-center"><div className="pixel-loader mx-auto mb-8" /><p className="font-pixel text-[9px]">{copy.loadingTelemetry}</p></div></div>;
}
