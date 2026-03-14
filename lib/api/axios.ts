import axios from "axios";
import { useAuthStore } from "@/store/authStore";

// Use environment variable for base URL
const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL;

// Create axios instance
export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
});

// Request interceptor - automatically adds token to requests
apiClient.interceptors.request.use(
  (config) => {
    // Log the request for debugging
    console.log("🚀 API Request:", {
      method: config.method?.toUpperCase(),
      url: `${config.baseURL}${config.url}`,
      data: config.data,
      headers: config.headers,
    });

    // Get token directly from Zustand store (no localStorage needed!)
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor - handles errors globally
apiClient.interceptors.response.use(
  (response) => {
    // Log successful response
    console.log("✅ API Response:", {
      status: response.status,
      data: response.data,
      url: response.config.url,
    });
    return response;
  },
  (error) => {
    // Log error details for debugging
    console.error("❌ API Error:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
    });

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      console.error(
        "404 Error: Endpoint not found. Check your URL:",
        error.config?.url
      );
    }

    // Handle CORS errors
    if (error.message.includes("Network Error") || !error.response) {
      console.error(
        "CORS or Network Error: The server might not be responding or CORS is not configured properly"
      );
    }

    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      const { clearAuth } = useAuthStore.getState();
      clearAuth();

      if (typeof window !== "undefined") {
        const isOnSignInPage = window.location.pathname.startsWith("/sign-in");
        if (!isOnSignInPage) {
          const redirect = `${window.location.pathname}${window.location.search}`;
          window.location.replace(`/sign-in?redirect=${encodeURIComponent(redirect)}`);
        }
      }
    }

    // Handle 500 Server Error
    if (error.response?.status === 500) {
      console.error("Server error:", error.response.data);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
