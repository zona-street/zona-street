import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/lib/types/auth";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;

  // Actions
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,

      login: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
          isAdmin: user.role === "admin",
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isAdmin: false,
        }),

      setUser: (user) =>
        set({
          user,
          isAdmin: user.role === "admin",
        }),
    }),
    {
      name: "zona-street-auth",
    }
  )
);
