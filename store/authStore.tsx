import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { authService } from "@/services/authServices";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      updateUser: (updatedUser) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        }));
      },

      // NEW: Verify token is still valid and fetch fresh user data
      checkAuth: async () => {
        try {
          const token = get().token;

          if (!token) {
            throw new Error("No token found");
          }

          // Fetch current user with existing token
          const userData = await authService.getCurrentUser(token);

          // Update user data
          set({
            user: userData,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error("Auth check failed:", error);
          // Clear auth state if token is invalid
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
          throw error;
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
