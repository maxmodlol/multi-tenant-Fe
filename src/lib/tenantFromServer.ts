// utils/detectTenantServerOnly.ts
import { headers } from "next/headers";
import { parseTenant } from "./tenant";

export async function detectTenantServerOnly(): Promise<string> {
  /* ── Strictly server side only ─────────────────────────── */
  const hdrs = await headers();
  const hostHeader = hdrs.get("x-forwarded-host") || hdrs.get("host") || undefined;

  return parseTenant(hostHeader);
}
