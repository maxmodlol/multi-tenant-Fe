// utils/detectTenantServerOnly.ts
import { headers } from "next/headers";

/** Works in both dev (Turbopack) and prod – no more TS error */
export async function detectTenantServerOnly(): Promise<string> {
  /* ── 1. Client side ─────────────────────────────────────────── */
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    return host.includes(".") ? host.split(".")[0] : "main";
  }

  /* ── 2. Server side (Edge/Node) ─────────────────────────────── */
  const hdrs = await headers(); // ← **await** the promise
  const host = hdrs.get("host") ?? ""; // now hdrs is ReadonlyHeaders
  const hostname = host.split(":")[0];
  const parts = hostname.split(".");

  return hostname === "localhost" || parts.length === 1 ? "main" : parts[0]; // e.g. “publisher1”
}
