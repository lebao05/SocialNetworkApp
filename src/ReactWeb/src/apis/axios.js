import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  paramsSerializer: (params) => {
    const parts = [];
    for (const key of Object.keys(params)) {
      const value = params[key];
      if (value === null || value === undefined) continue;
      const pascalKey = key.charAt(0).toUpperCase() + key.slice(1);
      if (Array.isArray(value)) {
        value.forEach((v) => parts.push(`${encodeURIComponent(pascalKey)}=${encodeURIComponent(v)}`));
      } else {
        parts.push(`${encodeURIComponent(pascalKey)}=${encodeURIComponent(value)}`);
      }
    }
    return parts.join("&");
  },
});

// Request interceptor (optional)
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (global error logging)
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Global Axios Error:", error);

    // Optionally show a toast notification
    // toast.error(error.response?.data?.message || "Something went wrong");

    // You can also log it to a server here
    // logErrorToServer(error);

    return Promise.reject(error); // still propagate error
  }
);

export default instance;