// utils/detectTenant.ts

const RESERVED = ["www", "api", "admin", "auth"];

export async function detectTenant(): Promise<string> {
  // ── 1. Client-side ─────────────────────────────────────────
  if (typeof window !== "undefined") {
    const [sub] = window.location.hostname.split(".");
    if (sub === "localhost" || RESERVED.includes(sub)) {
      return "main";
    }
    return sub;
  }

  // ── 2. Server-side ─────────────────────────────────────────
  try {
    const { headers } = await import("next/headers");
    const hdrs = await headers();

    // prefer x-forwarded-host if you’re behind a proxy/CDN
    const raw = (hdrs.get("x-forwarded-host") || hdrs.get("host") || "")
      .split(":")[0]
      .toLowerCase()
      .trim();

    const [sub] = raw.split(".");
    // if localhost, a reserved name, or no subdomain → “main”
    if (sub === "localhost" || RESERVED.includes(sub) || raw.split(".").length < 2) {
      return "main";
    }
    return sub;
  } catch {
    return "main";
  }
}
