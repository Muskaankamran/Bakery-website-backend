import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import api from "../api";
import { getApiErrorMessage, showErrorAlert } from "../utils/alerts";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  const fetchCurrentUser = useCallback(async () => {
    try {
      const { data } = await api.get("/auth/me");
      if (!data?.user) {
        throw new Error("The authentication API returned an invalid user response.");
      }
      setUser(data.user);
      setAuthError("");
      return data.user;
    } catch (error) {
      setUser(null);
      if (error.response?.status === 401) {
        setAuthError("");
        return null;
      }
      const message = getApiErrorMessage(error, "Could not reach the authentication service.");
      setAuthError(message);
      await showErrorAlert("Authentication service unavailable", message);
      return null;
    }
  }, []);

  useEffect(() => {
    const bootstrapUser = async () => {
      setLoading(true);
      await fetchCurrentUser();
      setLoading(false);
    };

    bootstrapUser();
  }, [fetchCurrentUser]);

  const login = async ({ username = "", email = "", password }) => {
    const { data } = await api.post("/auth/login", { username, email, password });
    if (!data?.user) {
      throw new Error("The authentication API returned an invalid user response.");
    }
    setUser(data.user);
    setAuthError("");
    return data;
  };

  const register = async ({ username, email, password }) => {
    const { data } = await api.post("/auth/register", { username, email, password });
    if (!data?.user) {
      throw new Error("The authentication API returned an invalid user response.");
    }
    setUser(data.user);
    setAuthError("");
    return data;
  };

  const logout = () => {
    setUser(null);
    setAuthError("");
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      authError,
      setUser,
      login,
      register,
      logout,
      fetchCurrentUser,
    }),
    [user, loading, authError, fetchCurrentUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
