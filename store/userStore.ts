import { create } from "zustand";

interface AuthState {
  isLoggedIn: boolean;
  userName: string;
  login: () => void;
  logout: () => void;
  setLoginState: (value: boolean) => void;
  setUserName: (value: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  userName: "",
  login: () => set({ isLoggedIn: true }),
  logout: () => set({ isLoggedIn: false }),
  setLoginState: (value) => set({ isLoggedIn: value }),
  setUserName: (value) => set({ userName: value }),
}));
