// src/lib/http/axiosPublic.ts
import axios from "axios";
import { getApiBaseUrl } from "./base";

export const apiPublic = axios.create({
  baseURL: getApiBaseUrl(),
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // keeps cookies for rate-limit etc.
});
