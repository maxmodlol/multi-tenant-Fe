export async function detectTenant(): Promise<string> {
  // ✅ Client-side
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    console.log("[detectTenant] client host =", host);
    return host.includes(".") ? host.split(".")[0] : "main";
  }

  // ❗️Fallback for server-side (used only in Next.js server components)
  try {
    const { headers } = await import("next/headers");
    const hdrList = await headers();
    const host = hdrList.get("host") ?? "";
    console.log("[detectTenant] SSR host =", host);
    const hostname = host.split(":")[0];
    return hostname.includes(".") ? hostname.split(".")[0] : "main";
  } catch {
    return "main";
  }
}
