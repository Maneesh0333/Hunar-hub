import { create } from "zustand";
import axiosApi from "../lib/axios";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "User" | "Entrepreneur" | "Admin";
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;

  initAuth: () => Promise<void>;
  login: (data: { accessToken: string; user: User }) => void;
  logout: () => void;
  setAccessToken: (token: string) => void;
}

// Create the store
export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  loading: true,

  initAuth: async () => {
    try {
      const refresh = await axiosApi.post("/auth/refresh-token");
      const token = refresh.data.accessToken;

      set({ accessToken: token });

      const userRes = await axiosApi.get("/auth/me");

      set({
        user: userRes.data.data,
        loading: false,
      });
    } catch {
      set({
        accessToken: null,
        user: null,
        loading: false,
      });
    }
  },

  login: (data) => set({ accessToken: data.accessToken, user: data.user }),

  logout: () => set({ accessToken: null, user: null }),
  setAccessToken: (token) =>
    set({
      accessToken: token,
    }),
}));
