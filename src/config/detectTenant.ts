// utils/detectTenant.ts

import { parseTenant } from "../lib/tenant";

export async function detectTenant(): Promise<string> {
  /* ── 1. Client side ───────────────────────────────────── */
  if (typeof window !== "undefined") {
    return parseTenant(window.location.hostname);
  }

  /* ── 2. Server side (Next 13/14 app dir) ──────────────── */
  try {
    const { headers } = await import("next/headers");
    const hdrs = await headers();
    const hostHeader = hdrs.get("x-forwarded-host") || hdrs.get("host") || undefined;

    return parseTenant(hostHeader);
  } catch {
    // build time or edge cases
    return "main";
  }
}
