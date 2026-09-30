"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import {
  getCurrentUser,
  login,
  logout,
} from "@/modules/auth/auth.api";

export interface User {
  _id?: string;
  id?: string;
  email: string;
  fullName?: string;
  name?: string;
  role?: string;
  status?: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  loginUser: (payload: LoginPayload) => Promise<void>;
  logoutUser: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(
  null
);

const getStorageKey = () => {
  if (typeof window === "undefined") return "iv_user";
  const path = window.location.pathname;
  if (path.startsWith("/admin")) return "iv_admin_user";
  if (path.startsWith("/vendor")) return "iv_vendor_user";
  return "iv_user";
};

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUserState] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const key = getStorageKey();
      const saved =
        localStorage.getItem(key) ||
        (key !== "iv_user" ? null : localStorage.getItem("iv_user"));
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          return {
            ...parsed,
            fullName: parsed.fullName || parsed.name,
            name: parsed.name || parsed.fullName,
          };
        }
      }
    } catch {}
    return null;
  });
  const [loading, setLoading] = useState(true);

  const setUser = (newUser: User | null) => {
    const key = getStorageKey();
    if (newUser) {
      const normalized: User = {
        ...newUser,
        fullName: newUser.fullName || newUser.name,
        name: newUser.name || newUser.fullName,
      };
      setUserState(normalized);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(key, JSON.stringify(normalized));
        } catch {}
      }
    } else {
      setUserState(null);
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem(key);
        } catch {}
      }
    }
  };

  const refreshUser = async () => {
    try {
      const response = await getCurrentUser();
      const rawUser = response?.data || response;
      if (rawUser && (rawUser.email || rawUser._id || rawUser.id)) {
        setUser(rawUser);
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number; data?: { code?: string } } };
      if (
        axiosErr?.response?.status === 401 ||
        axiosErr?.response?.data?.code === "TOKEN_VERSION_MISMATCH"
      ) {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (payload: LoginPayload) => {
    const res = await login(payload);
    const rawUser = res?.data || res?.user || res;
    if (rawUser && (rawUser.email || rawUser._id || rawUser.id)) {
      setUser(rawUser);
    }
    await refreshUser();
  };

  const logoutUser = async () => {
    try {
      const path = typeof window !== "undefined" ? window.location.pathname : "";
      const portal = path.startsWith("/admin") ? "admin" : path.startsWith("/vendor") ? "vendor" : "all";
      await logout(portal);
    } catch {}
    setUser(null);
  };

  useEffect(() => {
    let ignore = false;
    getCurrentUser()
      .then((response) => {
        if (ignore) return;
        const rawUser = response?.data || response;
        if (rawUser && (rawUser.email || rawUser._id || rawUser.id)) {
          setUser(rawUser);
        }
      })
      .catch((err: unknown) => {
        if (ignore) return;
        const axiosErr = err as { response?: { status?: number; data?: { code?: string } } };
        if (
          axiosErr?.response?.status === 401 ||
          axiosErr?.response?.data?.code === "TOKEN_VERSION_MISMATCH"
        ) {
          setUser(null);
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setUser,
        loginUser,
        logoutUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
}