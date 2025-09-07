import axios, { AxiosInstance } from "axios";
import { getApiBaseUrl } from "./base";
import { detectTenant } from "./detectTenant";

// Create a fresh instance and attach the correct tenant per request.
// Avoid a single cached instance because it would pin the first tenant seen
// (e.g. "main") and leak it across subdomains/requests during SSR.
export async function getApiPublic(tenantOverride?: string): Promise<AxiosInstance> {
  const instance = axios.create({
    baseURL: getApiBaseUrl(),
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Ensure x-tenant is correct for every request (SSR/CSR)
  instance.interceptors.request.use(async (config) => {
    const tenant = tenantOverride ?? (await detectTenant());
    config.headers["x-tenant"] = tenant;
    return config;
  });

  return instance;
}
