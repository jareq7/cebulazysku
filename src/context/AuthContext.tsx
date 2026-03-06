"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "bankafiliacje_users";
const SESSION_KEY = "bankafiliacje_session";

function getUsers(): Record<string, { user: User; password: string }> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveUsers(users: Record<string, { user: User; password: string }>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      try {
        const parsed = JSON.parse(session);
        setUser(parsed);
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const users = getUsers();
    const entry = users[email.toLowerCase()];
    if (!entry || entry.password !== password) return false;
    setUser(entry.user);
    localStorage.setItem(SESSION_KEY, JSON.stringify(entry.user));
    return true;
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string): Promise<boolean> => {
      const users = getUsers();
      const key = email.toLowerCase();
      if (users[key]) return false;

      const newUser: User = {
        id: crypto.randomUUID(),
        email: key,
        name,
        createdAt: new Date().toISOString(),
      };

      users[key] = { user: newUser, password };
      saveUsers(users);
      setUser(newUser);
      localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
      return true;
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
