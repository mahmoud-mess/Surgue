import { create } from 'zustand';
import { getAuthStatus } from '../lib/api';

interface User {
  id: string;
  display_name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAuthStatus: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  checkAuthStatus: async () => {
    try {
      set({ isLoading: true });
      const response = await getAuthStatus();
      if (response.data) {
        set({ user: response.data, isAuthenticated: true });
      }
    } catch (error) {
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },
  setUser: (user) => set({ user, isAuthenticated: !!user }),
}));