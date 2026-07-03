"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const sessionKey = "aibiz_analytics_session";

function getSessionId() {
  try {
    const existing = window.localStorage.getItem(sessionKey);
    if (existing) {
      return existing;
    }

    const next = window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(sessionKey, next);
    return next;
  } catch {
    return undefined;
  }
}

export function PageAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) {
      return;
    }

    const payload = JSON.stringify({
      path: `${window.location.pathname}${window.location.search}`,
      title: document.title,
      referrer: document.referrer,
      sessionId: getSessionId()
    });

    if (navigator.sendBeacon) {
      const body = new Blob([payload], { type: "application/json" });
      if (navigator.sendBeacon("/api/analytics", body)) {
        return;
      }
    }

    void fetch("/api/analytics", {
      body: payload,
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      method: "POST"
    });
  }, [pathname]);

  return null;
}
