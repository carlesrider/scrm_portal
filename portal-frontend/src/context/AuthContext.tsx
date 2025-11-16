import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import apiClient, { setAuthToken } from "../api/client";

type Contact = {
  contact_id: string;
  contact_name: string;
  contact_email?: string | null;
  username: string;
};

type AuthContextValue = {
  contact: Contact | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const LOCAL_STORAGE_KEY = "portal_jwt";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contact, setContact] = useState<Contact | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedToken = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!storedToken) {
      setLoading(false);
      return;
    }

    setAuthToken(storedToken);
    apiClient
      .get<{ contact: Contact }>("/auth/me")
      .then((response) => {
        setToken(storedToken);
        setContact(response.data.contact);
      })
      .catch(() => {
        window.localStorage.removeItem(LOCAL_STORAGE_KEY);
        setAuthToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (username: string, password: string) => {
    const response = await apiClient.post<{ token: string; contact: Contact }>("/auth/login", {
      username,
      password
    });

    setToken(response.data.token);
    setContact(response.data.contact);
    setAuthToken(response.data.token);
    window.localStorage.setItem(LOCAL_STORAGE_KEY, response.data.token);
  };

  const logout = async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      // ignore logout errors
    }
    setToken(null);
    setContact(null);
    setAuthToken(null);
    window.localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  const value = useMemo(
    () => ({
      contact,
      token,
      loading,
      login,
      logout
    }),
    [contact, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
