import { create } from "zustand";
import {
  blogService,
  Blog,
  CreateBlogData,
  UpdateBlogData,
} from "@/services/blogService";
import { imageUploadService } from "@/services/imageUploadService";
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
  uploadProgress: number;

  fetchBlogs: () => Promise<void>;
  fetchBlogById: (id: string) => Promise<void>;
  createBlog: (data: CreateBlogData, imageFiles?: File[]) => Promise<Blog>;
  updateBlog: (
    id: string,
    data: UpdateBlogData,
    imageFiles?: File[]
  ) => Promise<Blog>;
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
  uploadProgress: 0,

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

  createBlog: async (data: CreateBlogData, imageFiles?: File[]) => {
    set({ isLoading: true, error: null, uploadProgress: 0 });
    try {
      let uploadedImages: Array<{ imageUrl: string; isPrimary: boolean }> = [];

      if (imageFiles && imageFiles.length > 0) {
        console.log(`📤 Uploading ${imageFiles.length} images...`);

        const { validFiles, errors } =
          imageUploadService.validateMultipleImages(imageFiles);

        if (errors.length > 0) {
          console.warn("⚠️ Some files were invalid:", errors);
        }

        if (validFiles.length === 0) {
          throw new Error("No valid images to upload");
        }

        const imageOptions = validFiles.map((file) => ({
          file,
          metadata: {},
        }));

        const uploadResults = await imageUploadService.uploadMultipleImages(
          imageOptions,
          "public",
          (index, status) => {
            const progress = ((index + 1) / validFiles.length) * 50;
            set({ uploadProgress: progress });
            console.log(`Upload progress: ${progress}%`, status);
          }
        );

        uploadedImages = uploadResults.map((result, index) => ({
          imageUrl: result.publicUrl,
          isPrimary: index === 0,
        }));

        console.log("✅ All images uploaded:", uploadedImages);
      }

      const blogData: CreateBlogData = {
        ...data,
        images: uploadedImages.length > 0 ? uploadedImages : undefined,
      };

      set({ uploadProgress: 75 });

      const newBlog = await blogService.createBlog(blogData);

      set((state) => ({
        blogs: [newBlog, ...state.blogs],
        isLoading: false,
        uploadProgress: 100,
      }));

      console.log("✅ Blog created successfully with images:", newBlog);
      return newBlog;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Failed to create blog";
      set({ error: errorMessage, isLoading: false, uploadProgress: 0 });
      console.error("Failed to create blog:", error);
      throw error;
    }
  },

  updateBlog: async (id: string, data: UpdateBlogData, imageFiles?: File[]) => {
    set({ isLoading: true, error: null, uploadProgress: 0 });
    try {
      let uploadedImages: Array<{ imageUrl: string; isPrimary: boolean }> = [];

      if (imageFiles && imageFiles.length > 0) {
        console.log(`📤 Uploading ${imageFiles.length} new images...`);

        const { validFiles, errors } =
          imageUploadService.validateMultipleImages(imageFiles);

        if (errors.length > 0) {
          console.warn("⚠️ Some files were invalid:", errors);
        }

        if (validFiles.length > 0) {
          const imageOptions = validFiles.map((file) => ({
            file,
            metadata: {},
          }));

          const uploadResults = await imageUploadService.uploadMultipleImages(
            imageOptions,
            "public",
            (index, status) => {
              const progress = ((index + 1) / validFiles.length) * 50;
              set({ uploadProgress: progress });
              console.log(`Upload progress: ${progress}%`, status);
            }
          );

          uploadedImages = uploadResults.map((result, index) => ({
            imageUrl: result.publicUrl,
            isPrimary: index === 0,
          }));

          console.log("✅ All new images uploaded:", uploadedImages);
        }
      }

      const updateData: UpdateBlogData = {
        ...data,
        images: uploadedImages.length > 0 ? uploadedImages : data.images,
      };

      set({ uploadProgress: 75 });

      const updatedBlog = await blogService.updateBlog(id, updateData);

      set((state) => ({
        blogs: state.blogs.map((blog) => (blog.id === id ? updatedBlog : blog)),
        currentBlog:
          state.currentBlog?.id === id ? updatedBlog : state.currentBlog,
        isLoading: false,
        uploadProgress: 100,
      }));

      console.log("✅ Blog updated successfully:", updatedBlog);
      return updatedBlog;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Failed to update blog";
      set({ error: errorMessage, isLoading: false, uploadProgress: 0 });
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
