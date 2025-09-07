// config/base.ts
export const getApiBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl && typeof envUrl === "string") {
    return envUrl.replace(/\/$/, "");
  }
  // Fallback: assume backend is reachable under /api on same origin (dev proxy or unified domain)
  return "/api";
};
