// utils/detectTenantServerOnly.ts
import { headers } from "next/headers";
import { parseTenant } from "./tenant";

export async function detectTenantServerOnly(): Promise<string> {
  /* ── Client guard (should seldom run) ─────────────────── */
  if (typeof window !== "undefined") {
    return parseTenant(window.location.hostname);
  }

  /* ── Strictly server side ─────────────────────────────── */
  const hdrs = await headers();
  const hostHeader = hdrs.get("x-forwarded-host") || hdrs.get("host") || undefined;

  return parseTenant(hostHeader);
}
