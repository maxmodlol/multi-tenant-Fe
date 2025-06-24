// utils/detectTenant.ts
import { headers as _headers } from "next/headers";

const RESERVED = ["www", "api", "admin", "auth"];

export async function detectTenant(): Promise<string> {
  // 1️⃣ Client side
  if (typeof window !== "undefined") {
    const sub = window.location.hostname.split(".")[0];
    return sub === "localhost" || RESERVED.includes(sub) ? "main" : sub;
  }

  // 2️⃣ Server side
  const hdrList = await _headers(); // <-- await here
  const rawHost = (hdrList.get("x-forwarded-host") || hdrList.get("host") || "")
    .split(":")[0]
    .toLowerCase();

  const [first, ...rest] = rawHost.split(".");
  return rest.length === 0 || RESERVED.includes(first) ? "main" : first;
}
