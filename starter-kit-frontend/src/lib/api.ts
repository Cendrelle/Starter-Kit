import axios from "axios";
import { getAuthToken } from "@/lib/auth";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3030/api";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const path = typeof window !== "undefined" ? window.location.pathname : "";
  const scope = path.startsWith("/admin") ? "admin" : path.startsWith("/candidate") ? "candidate" : undefined;
  const token = getAuthToken(scope);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
