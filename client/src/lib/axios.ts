import axios from "axios";

const getBaseURL = () => {
  if (typeof window !== "undefined") {
    // Client-side: use same-origin proxy (Next.js rewrites /api/v1/* → localhost:5000/api/v1/*)
    return "/api/v1";
  }
  // Server-side (SSR): call the Express server directly
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
};

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    // Always use same-origin proxy on client side
    config.baseURL = "/api/v1";
  }
  return config;
});

// Refresh token state
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and request hasn't been retried yet
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      const url = originalRequest.url || "";
      // Don't attempt refresh for auth endpoints to prevent loops
      if (
        url.includes("/auth/login") ||
        url.includes("/auth/refresh-token") ||
        url.includes("/auth/refresh") ||
        url.includes("/auth/signup")
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue this request while refresh is in flight
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axiosInstance.post("/auth/refresh-token", {});
        processQueue(null);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);

        // Session is completely dead: cleanly redirect to login
        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname;
          if (
            currentPath.startsWith("/admin") &&
            currentPath !== "/admin/login" &&
            currentPath !== "/admin/signup"
          ) {
            window.location.href = "/admin/login";
          }
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;