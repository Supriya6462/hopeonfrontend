import axios, { type AxiosError } from "axios";

/**
 * Base API URL from environment variables
 * Falls back to localhost:3001 if not set
 */
const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

/**
 * Axios instance with default configuration
 */
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

/**
 * Request interceptor
 * Adds authentication token to requests
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * Handles common error scenarios
 */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle network errors
    if (!error.response) {
      console.error("Network Error:", {
        message: "Cannot connect to server",
        baseURL: BASE_URL,
        endpoint: error.config?.url,
      });
      
      return Promise.reject({
        message: "Cannot connect to server. Please check if the backend is running.",
        originalError: error,
      });
    }

    // Handle HTTP errors
    const status = error.response.status;
    
    switch (status) {
      case 401:
        // Unauthorized - Clear auth and redirect to login
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        break;
        
      case 403:
        // Forbidden
        console.error("Access forbidden:", error.response.data);
        break;
        
      case 404:
        // Not found
        console.error("API endpoint not found:", {
          url: error.config?.url,
          baseURL: BASE_URL,
          fullURL: `${BASE_URL}${error.config?.url}`,
        });
        break;
        
      case 500:
        // Server error
        console.error("Server error:", error.response.data);
        break;
    }

    return Promise.reject(error);
  }
);

export default api;

/**
 * Export base URL for debugging
 */
export const getBaseURL = () => BASE_URL;
