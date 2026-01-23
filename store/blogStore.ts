import { create } from "zustand";
import { blogService, Blog } from "@/services/blogService";

interface BlogState {
  blogs: Blog[];
  isLoading: boolean;
  error: string | null;
  fetchBlogs: () => Promise<void>;
  clearError: () => void;
}

export const useBlogStore = create<BlogState>((set) => ({
  blogs: [],
  isLoading: false,
  error: null,

  fetchBlogs: async () => {
    set({ isLoading: true, error: null });
    try {
      const blogs = await blogService.getAllBlogs();
      set({ blogs, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch blogs";
      set({ error: errorMessage, isLoading: false });
      console.error("Error fetching blogs:", error);
    }
  },

  clearError: () => set({ error: null }),
}));
