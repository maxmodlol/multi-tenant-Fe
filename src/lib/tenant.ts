// src/lib/tenant.ts
export const RESERVED = ["www", "api", "admin", "auth"] as const;

/**
 * MAIN_DOMAIN is read in this order:
 *   1. process.env.MAIN_DOMAIN               (SSR only)
 *   2. process.env.NEXT_PUBLIC_MAIN_DOMAIN   (bundled to the browser)
 *   3. fallback literal "localhost"
 */
export const MAIN_DOMAIN =
  process.env.MAIN_DOMAIN ?? process.env.NEXT_PUBLIC_MAIN_DOMAIN ?? "alnashra.co";

export type Tenant = "main" | string;

export function parseTenant(hostname: string | undefined): Tenant {
  if (!hostname) return "main";

  const host = hostname.split(":")[0].toLowerCase().trim();
  const parts = host.split(".");

  // localhost  |  reserved names  |  no real sub-domain (only 1-2 parts)
  if (
    host === "localhost" ||
    RESERVED.includes(parts[0] as (typeof RESERVED)[number]) ||
    parts.length < 2
  ) {
    return "main";
  }

  // Production domain check: www.alnashra.co should be main (3 parts, www is reserved)
  if (parts.length === 3 && RESERVED.includes(parts[0] as (typeof RESERVED)[number])) {
    return "main";
  }

  // e.g. publisher1.alnashra.co  →  "publisher1"
  if (host.endsWith(`.${MAIN_DOMAIN}`)) return parts[0];

  return "main";
}
