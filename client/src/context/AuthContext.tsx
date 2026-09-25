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

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const setUser = (newUser: User | null) => {
    if (newUser) {
      const normalized: User = {
        ...newUser,
        fullName: newUser.fullName || newUser.name,
        name: newUser.name || newUser.fullName,
      };
      setUserState(normalized);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("iv_user", JSON.stringify(normalized));
        } catch {}
      }
    } else {
      setUserState(null);
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("iv_user");
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
    } catch {
      // Keep existing user if session is still valid locally, or clear on auth error
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
      await logout();
    } catch {}
    setUser(null);
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem("iv_user");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          setUserState({
            ...parsed,
            fullName: parsed.fullName || parsed.name,
            name: parsed.name || parsed.fullName,
          });
        }
      }
    } catch {}
    refreshUser();
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