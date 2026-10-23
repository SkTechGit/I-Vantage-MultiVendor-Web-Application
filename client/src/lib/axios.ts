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

export const getPortalFromContext = (
  currentPath: string,
  reqUrl: string = ""
): "professional" | "vendor" | "admin" | "all" => {
  // 1. Browser path takes strict precedence as it represents the active session context
  if (
    currentPath.startsWith("/dashboard/professional") ||
    currentPath.startsWith("/professional")
  ) {
    return "professional";
  }
  if (
    currentPath.startsWith("/dashboard/vendor") ||
    currentPath.startsWith("/vendor")
  ) {
    return "vendor";
  }
  if (currentPath.startsWith("/admin")) {
    return "admin";
  }

  // 2. Fallback to requested URL pattern for background or public API calls
  if (reqUrl.includes("/professionals")) {
    return "professional";
  }
  if (reqUrl.includes("/vendor")) {
    return "vendor";
  }
  if (reqUrl.includes("/admin")) {
    return "admin";
  }

  return "all";
};

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const path = window.location.pathname;
    const url = config.url || "";
    if (!config.headers["x-portal"]) {
      const portal = getPortalFromContext(path, url);
      if (portal !== "all") {
        config.headers["x-portal"] = portal;
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
        const portal = getPortalFromContext(currentPath, reqUrl);

        try {
          if (portal === "admin") {
            localStorage.removeItem("iv_admin_user");
          } else if (portal === "vendor") {
            localStorage.removeItem("iv_vendor_user");
          } else if (portal === "professional") {
            localStorage.removeItem("iv_pro_user");
          } else {
            localStorage.removeItem("iv_user");
          }
        } catch { }

        if (
          portal === "admin" &&
          currentPath !== "/admin/login" &&
          currentPath !== "/admin/signup"
        ) {
          window.location.href = "/admin/login?reason=session_invalidated";
        } else if (
          portal === "vendor" &&
          currentPath !== "/vendor/login" &&
          currentPath !== "/vendor/signup"
        ) {
          window.location.href = "/vendor/login?reason=session_invalidated";
        } else if (
          portal === "professional" &&
          currentPath !== "/professional/login"
        ) {
          window.location.href = "/professional/login?reason=session_invalidated";
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
        portal = getPortalFromContext(currentPath, url);
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
