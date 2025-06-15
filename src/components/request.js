// src/components/request.js
import axios from "axios";

// Create an Axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "https://staff-records-backend.onrender.com/api",
  withCredentials: true, // For cookies (if using session-based auth)
  headers: {
    "Content-Type": "application/json", // Default, can be overridden per request
  },
});

// Optional: Add request/response interceptors
api.interceptors.request.use(
  (config) => {
    // Modify requests before sending (e.g., add auth token)
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally (e.g., redirect on 401)
    if (error.response?.status === 401) {
      window.location.href = "/superadmin/login"; // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;