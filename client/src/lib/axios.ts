import axios from "axios";

const getBaseURL = () => {
  if (typeof window !== "undefined") {
    return "/api/v1";
  }
  const envUrl =
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:5000/api/v1";
  return envUrl.replace("//localhost", "//127.0.0.1");
};

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
  },
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

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const path = window.location.pathname;
    const url = config.url || "";
    if (!config.headers["x-portal"]) {
      if (url.includes("/admin") || path.startsWith("/admin")) {
        config.headers["x-portal"] = "admin";
      } else if (url.includes("/vendor") || path.startsWith("/vendor")) {
        config.headers["x-portal"] = "vendor";
      }
    }
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const isTokenVersionMismatch =
      error.response?.status === 401 &&
      error.response?.data?.code === "TOKEN_VERSION_MISMATCH";

    const clearClientSession = () => {
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        const reqUrl = originalRequest?.url || "";
        const isAdmin = reqUrl.includes("/admin") || currentPath.startsWith("/admin");
        const isVendor = reqUrl.includes("/vendor") || currentPath.startsWith("/vendor");

        try {
          if (isAdmin) {
            localStorage.removeItem("iv_admin_user");
          } else if (isVendor) {
            localStorage.removeItem("iv_vendor_user");
          } else {
            localStorage.removeItem("iv_user");
          }
        } catch { }

        if (
          isAdmin &&
          currentPath !== "/admin/login" &&
          currentPath !== "/admin/signup"
        ) {
          window.location.href = "/admin/login?reason=session_invalidated";
        } else if (
          isVendor &&
          currentPath !== "/vendor/login" &&
          currentPath !== "/vendor/signup"
        ) {
          window.location.href = "/vendor/login?reason=session_invalidated";
        }
      }
    };

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      if (isTokenVersionMismatch) {
        clearClientSession();
        return Promise.reject(error);
      }

      const url = originalRequest.url || "";

      // Never try refresh for auth endpoints
      if (
        url.includes("/auth/login") ||
        url.includes("/auth/signup") ||
        url.includes("/auth/register") ||
        url.includes("/auth/refresh-token")
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve,
            reject,
          });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      let portal = "all";
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        if (url.includes("/admin") || currentPath.startsWith("/admin")) {
          portal = "admin";
        } else if (url.includes("/vendor") || currentPath.startsWith("/vendor")) {
          portal = "vendor";
        }
      }

      try {
        await axiosInstance.post(
          `/auth/refresh-token?portal=${portal}`,
          { portal },
          { headers: { "x-portal": portal } }
        );

        processQueue(null);

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        clearClientSession();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
