import axios from "axios";

// Get base URL from environment or construct from current location
const getBaseURL = () => {
  const envURL = import.meta.env.VITE_API_URL;
  if (envURL && envURL.trim()) {
    return envURL;
  }
  // Fallback for production (if env var not set)
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return "http://localhost:5000";
  }
  // For production deployment
  return "https://chatakh-creations.onrender.com";
};

const baseURL = getBaseURL();
console.log("✅ API Base URL:", baseURL);

const api = axios.create({
  baseURL,
  // Render free-tier sleeps: first request can take 30-60s to wake it.
  timeout: 90000,
});

// Cold-start retry: retry failed GETs (network error / timeout / 5xx) so the
// site recovers by itself while Render wakes up instead of showing empty.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    const status = error.response?.status;
    const retriable =
      config &&
      config.method?.toLowerCase() === "get" &&
      (!error.response || status >= 500);
    config.__retries = config.__retries || 0;
    if (retriable && config.__retries < 3) {
      config.__retries += 1;
      const wait = config.__retries * 4000;
      console.warn(`⏳ Backend waking up… retry ${config.__retries}/3 in ${wait / 1000}s`);
      await new Promise((r) => setTimeout(r, wait));
      return api(config);
    }
    return Promise.reject(error);
  }
);

let interceptorSetup = false;
let currentGetToken = null;

// Setup interceptor with proper singleton pattern
export const setupAxiosInterceptors = (getToken) => {
  // Only set up once to avoid duplicate interceptors
  if (interceptorSetup && currentGetToken) {
    console.log("✅ Interceptor already set up, updating getToken function");
    currentGetToken = getToken;
    return;
  }

  currentGetToken = getToken;
  interceptorSetup = true;

  console.log("✅ Setting up axios interceptors...");

  // Request interceptor - Add token to every request
  api.interceptors.request.use(
    async (config) => {
      try {
        if (currentGetToken) {
          const token = await currentGetToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log("✅ Token injected into request:", config.url);
          } else {
            console.warn("⚠️ No token available for request:", config.url);
          }
        }
      } catch (err) {
        console.error("❌ Error getting token:", err.message);
      }
      return config;
    },
    (error) => {
      console.error("❌ Request interceptor error:", error);
      return Promise.reject(error);
    }
  );

  // Response interceptor - Handle authentication errors
  api.interceptors.response.use(
    (response) => {
      console.log("✅ Response OK from:", response.config.url);
      return response;
    },
    (error) => {
      const status = error.response?.status;
      const url = error.config?.url;
      const message = error.response?.data?.message || error.message;

      console.error("❌ Response error:", {
        status,
        url,
        message,
      });

      if (status === 401) {
        console.error("❌ 401 Unauthorized - Token may be invalid or expired");
      } else if (status === 404) {
        console.error("❌ 404 Not found - Check if backend is running:", url);
      } else if (status === 403) {
        console.error("❌ 403 Forbidden - Admin access required");
      } else if (!error.response) {
        console.error("❌ Network error - Cannot reach backend at:", baseURL);
      }

      return Promise.reject(error);
    }
  );
};

// Manual token injection for first requests before interceptor is ready
export const makeAuthenticatedRequest = async (method, url, data = null, getToken) => {
  try {
    const token = await getToken();
    const config = {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
    
    if (method === "get") {
      return await api.get(url, config);
    } else if (method === "post") {
      return await api.post(url, data, config);
    } else if (method === "put") {
      return await api.put(url, data, config);
    } else if (method === "delete") {
      return await api.delete(url, config);
    }
  } catch (error) {
    console.error(`Error in ${method.toUpperCase()} ${url}:`, error);
    throw error;
  }
};

export default api;
