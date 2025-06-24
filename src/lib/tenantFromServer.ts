// utils/detectTenantServerOnly.ts
import { headers } from "next/headers";

const RESERVED = [
  "www", // you might already have
  "api", // ← treat your backend URL as “main”
  "admin", // any other service subdomains
  "auth", // next-auth callback host
];

export async function detectTenantServerOnly(): Promise<string> {
  // ─── Client ───────────────────────────────────────────────
  if (typeof window !== "undefined") {
    const host = window.location.hostname; // e.g. "api.alnashra.co" or "publisher1.alnashra.co"
    const sub = host.split(".")[0]; // “api” or “publisher1”
    if (sub === "localhost" || RESERVED.includes(sub)) {
      return "main";
    }
    return sub;
  }

  // ─── Server ───────────────────────────────────────────────
  const hdrs = await headers();
  // prefer x-forwarded-host if you’re behind Cloudflare/nginx
  const rawHost = (hdrs.get("x-forwarded-host") || hdrs.get("host") || "")
    .split(":")[0]
    .toLowerCase()
    .trim();

  const parts = rawHost.split(".");
  // if no subdomain (only 2 parts) or it’s reserved, treat as "main"
  if (parts.length < 3 || RESERVED.includes(parts[0])) {
    return "main";
  }
  return parts[0]; // a real publisher subdomain
}
