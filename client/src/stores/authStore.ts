import { create } from "zustand";

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
}

interface AuthState {
    isAuthenticated: boolean;
    user?: User;
    authToken?: string ;
    setAuthentication: (user: User, token: string) => void;
    setUser: (user: User) => void;
    setAuthToken: (token: string) => void;
    logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  authToken: null,
  setAuthentication: (user: User, token: string) => set({ user, authToken: token, isAuthenticated: true }),
  setUser: (user: User) => set({ user, isAuthenticated: true }),
  setAuthToken: (token: string) => set({ authToken: token }),
  logout: () => set({ user: null, authToken: null, isAuthenticated: false }),
}));

export default useAuthStore;
