import axios from "axios";

export const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const apiBaseUrl = import.meta.env.DEV && !import.meta.env.VITE_API_BASE_URL
  ? "/api"
  : `${backendUrl.replace(/\/+$/, "")}/api`;

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

export default api;
