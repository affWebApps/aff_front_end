import { create } from "zustand";
import {
  blogService,
  Blog,
  CreateBlogData,
  UpdateBlogData,
} from "@/services/blogService";
import { AxiosError } from "axios";

interface ApiErrorResponse {
  message?: string;
  detail?: string;
  error?: string;
  [key: string]: unknown;
}

interface BlogState {
  blogs: Blog[];
  currentBlog: Blog | null;
  isLoading: boolean;
  error: string | null;

  fetchBlogs: () => Promise<void>;
  fetchBlogById: (id: string) => Promise<void>;
  createBlog: (data: CreateBlogData) => Promise<Blog>;
  updateBlog: (id: string, data: UpdateBlogData) => Promise<Blog>;
  deleteBlog: (id: string) => Promise<void>;
  setCurrentBlog: (blog: Blog | null) => void;
  clearBlogs: () => void;
  clearError: () => void;
}

export const useBlogStore = create<BlogState>((set) => ({
  blogs: [],
  currentBlog: null,
  isLoading: false,
  error: null,

  fetchBlogs: async () => {
    set({ isLoading: true, error: null });
    try {
      const blogsData = await blogService.getAllBlogs();
      set({ blogs: blogsData, isLoading: false });
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Failed to fetch blogs";
      set({ error: errorMessage, isLoading: false });
      console.error("Failed to fetch blogs:", error);
    }
  },

  fetchBlogById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const blogData = await blogService.getBlogById(id);
      set({ currentBlog: blogData, isLoading: false });
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Failed to fetch blog";
      set({ error: errorMessage, isLoading: false });
      console.error("Failed to fetch blog:", error);
    }
  },

  createBlog: async (data: CreateBlogData) => {
    set({ isLoading: true, error: null });
    try {
      const newBlog = await blogService.createBlog(data);

      set((state) => ({
        blogs: [newBlog, ...state.blogs],
        isLoading: false,
      }));

      return newBlog;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Failed to create blog";
      set({ error: errorMessage, isLoading: false });
      console.error("Failed to create blog:", error);
      throw error;
    }
  },

  updateBlog: async (id: string, data: UpdateBlogData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedBlog = await blogService.updateBlog(id, data);

      set((state) => ({
        blogs: state.blogs.map((blog) => (blog.id === id ? updatedBlog : blog)),
        currentBlog:
          state.currentBlog?.id === id ? updatedBlog : state.currentBlog,
        isLoading: false,
      }));

      return updatedBlog;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Failed to update blog";
      set({ error: errorMessage, isLoading: false });
      console.error("Failed to update blog:", error);
      throw error;
    }
  },

  deleteBlog: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await blogService.deleteBlog(id);

      set((state) => ({
        blogs: state.blogs.filter((blog) => blog.id !== id),
        currentBlog: state.currentBlog?.id === id ? null : state.currentBlog,
        isLoading: false,
      }));
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Failed to delete blog";
      set({ error: errorMessage, isLoading: false });
      console.error("Failed to delete blog:", error);
      throw error;
    }
  },

  setCurrentBlog: (blog: Blog | null) => {
    set({ currentBlog: blog });
  },

  clearBlogs: () => {
    set({ blogs: [], currentBlog: null, error: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
