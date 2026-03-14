// store/authStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { authService, User } from "@/services/authServices";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  logout: () => Promise<void>;
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
        console.log("✅ Setting auth in store:", {
          userId: user.id,
          email: user.email,
        });
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      clearAuth: () => {
        console.log("🔄 Clearing auth state...");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      logout: async () => {
        const token = get().token;

        // Call backend logout endpoint if token exists
        if (token) {
          try {
            await authService.logout(token);
          } catch (error) {
            console.error("Backend logout failed:", error);
            // Continue with local cleanup even if API fails
          }
        }

        // Clear auth state (this will automatically clear localStorage via zustand persist)
        get().clearAuth();

        console.log("✅ Logout complete");
      },

      updateUser: (updatedUser) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        }));
      },

      // Verify token is still valid and fetch fresh user data
      checkAuth: async () => {
        try {
          const token = get().token;

          if (!token) {
            throw new Error("No token found");
          }

          console.log("🔄 Checking auth status...");

          // Fetch current user with existing token
          const userData = await authService.getCurrentUser(token);

          console.log("✅ Auth check successful");

          // Update user data
          set({
            user: userData,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error("❌ Auth check failed:", error);
          // Clear auth state if token is invalid
          get().clearAuth();
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
