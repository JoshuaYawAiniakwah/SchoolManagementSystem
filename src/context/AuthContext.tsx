// src/context/AuthContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

// Type definitions
type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  authFetch: typeof authFetch;
};

type AuthProviderProps = {
  children: ReactNode;
};

// Default context value
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  token: null,
  login: async () => {},
  logout: () => {},
  refreshToken: async () => false,
  authFetch: async () => new Response(),
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // Auth initialization (no token verification)
  const initializeAuth = useCallback(async () => {
    setIsLoading(true);

    try {
      const savedToken = localStorage.getItem("token");

      if (savedToken) {
        setToken(savedToken);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      clearAuth();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (newToken: string) => {
    try {
      localStorage.setItem("token", newToken);
      setToken(newToken);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    router.push("/login");
  }, [router]);

  const clearAuth = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setIsAuthenticated(false);
  }, []);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    console.warn("Refresh token logic not implemented.");
    return false;
  }, []);

  const authFetch = useCallback(
    async (url: string, options: RequestInit = {}) => {
      let currentToken = token || localStorage.getItem("token");
      if (!currentToken) throw new Error("No authentication token available");

      const headers = new Headers(options.headers);
      headers.set("Authorization", `Bearer ${currentToken}`);
      headers.set("Content-Type", "application/json");

      let response = await fetch(url, { ...options, headers });

      if (response.status === 401) {
        logout();
        throw new Error("Session expired. Please login again.");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Request failed");
      }

      return response;
    },
    [token, logout]
  );

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        token,
        login,
        logout,
        refreshToken,
        authFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// useAuth hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// ProtectedRoute wrapper
export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 rounded-full border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>Verifying authentication...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : null;
};

// Standalone fetch
export const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("Content-Type", "application/json");

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    throw new Error("Session expired. Please login again.");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Request failed");
  }

  return response;
};
