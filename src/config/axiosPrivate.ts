import axios, { AxiosInstance } from "axios";
import { getApiBaseUrl } from "./base";
import { getSession } from "next-auth/react";
import { detectTenant } from "./detectTenant";

let apiPrivate: AxiosInstance | null = null;

export async function getApiPrivate(): Promise<AxiosInstance> {
  if (apiPrivate) return apiPrivate;

  apiPrivate = axios.create({
    baseURL: getApiBaseUrl(),
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });

  // ① Attach tenant
  apiPrivate.interceptors.request.use(async (config) => {
    config.headers["x-tenant"] = await detectTenant();
    return config;
  });

  // ② Attach bearer token (once per startup)
  let tokenCache: string | undefined;
  apiPrivate.interceptors.request.use(async (config) => {
    if (!tokenCache) {
      const sess = await getSession();
      tokenCache = (sess as any)?.token;
    }
    if (tokenCache) config.headers.Authorization = `Bearer ${tokenCache}`;
    return config;
  });

  return apiPrivate;
}
