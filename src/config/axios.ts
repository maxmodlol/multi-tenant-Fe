import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getSession } from "next-auth/react";
import queryString from "query-string";

const getApiBaseUrl = () => {
  if (typeof window !== "undefined") {
    const { hostname } = window.location; // Get current subdomain
    if (hostname.includes(".")) {
      return `http://${hostname}:5000`; // Handles publisher1.localhost:5000
    }
  }
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"; // Default to main domain
};

// ✅ Create Axios instance with dynamic base URL
const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Automatically attach JWT token to every request
api.interceptors.request.use(async (config) => {
  const sess = await getSession();
  const raw = (sess as any)?.token; // <— bypass TS for now
  if (raw) {
    config.headers.Authorization = `Bearer ${raw}`;
  }
  return config;
});

// Utility function for GET requests
export const GetApi = async <Response, Query = null>(
  url: string,
  query?: Query,
  config?: AxiosRequestConfig,
) => {
  let newUrl = url;
  if (query) {
    newUrl = `${newUrl}?${queryString.stringify(query)}`;
  }
  return api.get<Response, AxiosResponse<Response>>(newUrl, config).then((res) => res.data);
};

// Utility function for DELETE requests
export const DeleteApi = async <Response, Query = null>(
  url: string,
  query?: Query,
  config?: AxiosRequestConfig,
) => {
  let newUrl = url;
  if (query) {
    newUrl = `${newUrl}?${queryString.stringify(query)}`;
  }
  return api.delete<Response, AxiosResponse<Response>>(newUrl, config).then((res) => res.data);
};

// Utility function for POST requests
export const PostApi = async <Data, Response, Query = null>(
  url: string,
  data: Data,
  query?: Query,
  config?: AxiosRequestConfig<Data>,
) => {
  let newUrl = url;
  if (query) {
    newUrl = `${newUrl}?${queryString.stringify(query)}`;
  }
  return api
    .post<Response, AxiosResponse<Response>, Data>(newUrl, data, config)
    .then((res) => res.data);
};

// Utility function for PUT requests
export const PutApi = async <Data, Response, Query = null>(
  url: string,
  data: Data,
  query?: Query,
  config?: AxiosRequestConfig<Data>,
) => {
  let newUrl = url;
  if (query) {
    newUrl = `${newUrl}?${queryString.stringify(query)}`;
  }
  return api
    .put<Response, AxiosResponse<Response>, Data>(newUrl, data, config)
    .then((res) => res.data);
};

// Export Axios instance for direct use if needed
export default api;
