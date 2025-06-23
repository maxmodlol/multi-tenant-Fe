// utils/detectTenantServerOnly.ts
import { headers } from "next/headers";

export async function detectTenantServerOnly(): Promise<string> {
  // client
  if (typeof window !== "undefined") {
    const sub = window.location.hostname.split(".")[0];
    return sub === "localhost" ? "main" : sub;
  }
  // server
  const hdrs = await headers();
  const host = (hdrs.get("x-forwarded-host") || hdrs.get("host") || "").split(":")[0];
  const parts = host.split(".");
  return parts.length < 3 || host === "localhost" ? "main" : parts[0];
}
