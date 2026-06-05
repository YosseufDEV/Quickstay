import { create } from "zustand";

interface AuthState {
    isAuthenticated: boolean;
    user: string | null;
    authToken: string | null;
    setAuthentication: (user: string, token: string) => void;
    setUser: (user: string) => void;
    setAuthToken: (token: string) => void;
    logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  authToken: null,
  setAuthentication: (user: string, token: string) => set({ user, authToken: token, isAuthenticated: true }),
  setUser: (user: string) => set({ user, isAuthenticated: true }),
  setAuthToken: (token: string) => set({ authToken: token }),
  logout: () => set({ user: null, authToken: null, isAuthenticated: false }),
}));

export default useAuthStore;
