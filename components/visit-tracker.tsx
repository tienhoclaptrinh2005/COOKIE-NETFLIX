"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const trackedPaths = new Set(["/", "/receive", "/login"]);

export function VisitTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (!trackedPaths.has(pathname) || lastTrackedPath.current === pathname) return;

    let sent = false;
    const send = () => {
      if (sent || document.visibilityState !== "visible") return;
      sent = true;
      lastTrackedPath.current = pathname;
      void fetch("/api/visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        cache: "no-store",
        keepalive: true,
        body: JSON.stringify({ path: pathname, eventId: crypto.randomUUID() }),
      }).catch(() => undefined);
    };

    send();
    if (!sent) document.addEventListener("visibilitychange", send);
    return () => document.removeEventListener("visibilitychange", send);
  }, [pathname]);

  return null;
}
