import axios, { AxiosInstance } from "axios";
import { getApiBaseUrl } from "./base";
import { detectTenant } from "./detectTenant";

let apiPublic: AxiosInstance | null = null;

export async function getApiPublic(tenantOverride?: string): Promise<AxiosInstance> {
  if (apiPublic) return apiPublic;

  const tenant = tenantOverride ?? (await detectTenant());

  apiPublic = axios.create({
    baseURL: getApiBaseUrl(),
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      "x-tenant": tenant,
    },
  });

  return apiPublic;
}
