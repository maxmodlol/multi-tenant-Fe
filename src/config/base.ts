// src/lib/http/base.ts
export const getApiBaseUrl = () => {
  if (typeof window !== "undefined") {
    const { hostname } = window.location;
    if (hostname.includes(".")) {
      return `http://${hostname}:5000`; // tenant.localhost → backend
    }
  }
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
};
