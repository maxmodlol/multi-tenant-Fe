// src/lib/http/axiosPrivate.ts
import axios from "axios";
import { getApiBaseUrl } from "./base";
import { getSession } from "next-auth/react";

export const apiPrivate = axios.create({
  baseURL: getApiBaseUrl(),
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

let tokenCache: string | undefined; // avoids 2nd /session call

apiPrivate.interceptors.request.use(async (config) => {
  if (!tokenCache) {
    const sess = await getSession(); // ONE call after login
    tokenCache = (sess as any)?.token;
  }
  if (tokenCache) {
    config.headers.Authorization = `Bearer ${tokenCache}`;
  }
  return config;
});
