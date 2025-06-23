// src/lib/http/helpers.ts
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import queryString from "query-string";

const buildGet =
  (api: AxiosInstance) =>
  async <R, Q = null>(url: string, query?: Q, config?: AxiosRequestConfig): Promise<R> => {
    const full = query ? `${url}?${queryString.stringify(query)}` : url;
    return api.get<R, AxiosResponse<R>>(full, config).then((r) => r.data);
  };

const buildDelete =
  (api: AxiosInstance) =>
  async <R, Q = null>(url: string, query?: Q, config?: AxiosRequestConfig) => {
    const full = query ? `${url}?${queryString.stringify(query)}` : url;
    return api.delete<R, AxiosResponse<R>>(full, config).then((r) => r.data);
  };

// same pattern for Post & Put:
const buildPost =
  (api: AxiosInstance) =>
  async <D, R, Q = null>(url: string, data: D, query?: Q, config?: AxiosRequestConfig<D>) => {
    const full = query ? `${url}?${queryString.stringify(query)}` : url;
    return api.post<R, AxiosResponse<R>, D>(full, data, config).then((r) => r.data);
  };

const buildPut =
  (api: AxiosInstance) =>
  async <D, R, Q = null>(url: string, data: D, query?: Q, config?: AxiosRequestConfig<D>) => {
    const full = query ? `${url}?${queryString.stringify(query)}` : url;
    return api.put<R, AxiosResponse<R>, D>(full, data, config).then((r) => r.data);
  };

export const createHttpHelpers = (api: AxiosInstance) => ({
  GetApi: buildGet(api),
  DeleteApi: buildDelete(api),
  PostApi: buildPost(api),
  PutApi: buildPut(api),
});
