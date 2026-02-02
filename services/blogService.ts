import apiClient from "../lib/api/axios";
import { AxiosError } from "axios";

interface ApiErrorResponse {
  message?: string;
  detail?: string;
  error?: string;
  [key: string]: unknown;
}


export interface BlogImage {
  id: string;
  blog_id: string;
  image_url: string;
  is_primary: boolean;
}


export interface Blog {
  id: string;
  title: string;
  content: string;
  scheduled_for: string;
  status: "draft" | "scheduled" | "published";
  created_at: string;
  updated_at: string;
  images: BlogImage[];
}

export interface CreateBlogData {
  title: string;
  content: string;
  status?: "draft" | "scheduled" | "published";
  scheduledFor?: string; 
  images?: Array<{
    imageUrl: string;
    isPrimary?: boolean;
  }>;
}

// Update Blog Data Interface
export interface UpdateBlogData {
  title?: string;
  content?: string;
  status?: "draft" | "scheduled" | "published";
  scheduledFor?: string; 
  images?: Array<{
    imageUrl: string;
    isPrimary?: boolean;
  }>;
}

export const blogService = {
 
  getAllBlogs: async (): Promise<Blog[]> => {
    try {
      console.log("📂 Fetching all blogs...");

      const response = await apiClient.get<Blog[]>("/admin/blogs/");

      console.log("✅ Blogs fetched:", response.data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      console.error("❌ Get all blogs failed:", {
        message: axiosError.message,
        status: axiosError.response?.status,
        url: axiosError.config?.url,
      });
      throw error;
    }
  },

  getBlogById: async (blogId: string): Promise<Blog> => {
    try {
      console.log("📂 Fetching blog:", blogId);

      const response = await apiClient.get<Blog>(`/admin/blogs/${blogId}`);

      console.log("✅ Blog fetched:", response.data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      console.error("❌ Get blog failed:", {
        message: axiosError.message,
        status: axiosError.response?.status,
        url: axiosError.config?.url,
      });
      throw error;
    }
  },


  createBlog: async (data: CreateBlogData): Promise<Blog> => {
    try {
      console.log("📝 Creating blog:", data);

      const response = await apiClient.post<Blog>("/admin/blogs/", data);

      console.log("✅ Blog created:", response.data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      console.error("❌ Create blog failed:", axiosError);
      throw error;
    }
  },

 
  updateBlog: async (blogId: string, data: UpdateBlogData): Promise<Blog> => {
    try {
      console.log("✏️ Updating blog:", blogId, data);

      const response = await apiClient.patch<Blog>(
        `/admin/blogs/${blogId}`,
        data
      );

      console.log("✅ Blog updated:", response.data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      console.error("❌ Update blog failed:", axiosError);
      throw error;
    }
  },

  
  deleteBlog: async (blogId: string): Promise<{ status: string }> => {
    try {
      console.log("🗑️ Deleting blog:", blogId);

      const response = await apiClient.delete<{ status: string }>(
        `/admin/blogs/${blogId}`
      );

      console.log("✅ Blog deleted:", response.data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      console.error("❌ Delete blog failed:", axiosError);
      throw error;
    }
  },
};
import apiClient from "../lib/api/axios";
import { AxiosError } from "axios";

interface ApiErrorResponse {
  message?: string;
  detail?: string;
  error?: string;
  [key: string]: unknown;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  scheduled_for: string;
  status: "draft" | "published" | "scheduled";
  created_at: string;
  updated_at: string;
  images: string[];
}

export const blogService = {
  getAllBlogs: async (): Promise<Blog[]> => {
    try {
      const response = await apiClient.get<Blog[]>("/blogs/");
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      console.error("Get blogs failed:", {
        message: axiosError.message,
        status: axiosError.response?.status,
        url: axiosError.config?.url,
      });
      throw error;
    }
  },
};
import apiClient from "../lib/api/axios";
import { AxiosError } from "axios";

interface ApiErrorResponse {
  message?: string;
  detail?: string;
  error?: string;
  [key: string]: unknown;
}


export interface BlogImage {
  id: string;
  blog_id: string;
  image_url: string;
  is_primary: boolean;
}


export interface Blog {
  id: string;
  title: string;
  content: string;
  scheduled_for: string;
  status: "draft" | "scheduled" | "published";
  created_at: string;
  updated_at: string;
  images: BlogImage[];
}

export interface CreateBlogData {
  title: string;
  content: string;
  status?: "draft" | "scheduled" | "published";
  scheduledFor?: string; 
  images?: Array<{
    imageUrl: string;
    isPrimary?: boolean;
  }>;
}

// Update Blog Data Interface
export interface UpdateBlogData {
  title?: string;
  content?: string;
  status?: "draft" | "scheduled" | "published";
  scheduledFor?: string; 
  images?: Array<{
    imageUrl: string;
    isPrimary?: boolean;
  }>;
}

export const blogService = {
 
  getAllBlogs: async (): Promise<Blog[]> => {
    try {
      console.log("📂 Fetching all blogs...");

      const response = await apiClient.get<Blog[]>("/admin/blogs/");

      console.log("✅ Blogs fetched:", response.data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      console.error("❌ Get all blogs failed:", {
        message: axiosError.message,
        status: axiosError.response?.status,
        url: axiosError.config?.url,
      });
      throw error;
    }
  },

  getBlogById: async (blogId: string): Promise<Blog> => {
    try {
      console.log("📂 Fetching blog:", blogId);

      const response = await apiClient.get<Blog>(`/admin/blogs/${blogId}`);

      console.log("✅ Blog fetched:", response.data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      console.error("❌ Get blog failed:", {
        message: axiosError.message,
        status: axiosError.response?.status,
        url: axiosError.config?.url,
      });
      throw error;
    }
  },


  createBlog: async (data: CreateBlogData): Promise<Blog> => {
    try {
      console.log("📝 Creating blog:", data);

      const response = await apiClient.post<Blog>("/admin/blogs/", data);

      console.log("✅ Blog created:", response.data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      console.error("❌ Create blog failed:", axiosError);
      throw error;
    }
  },

 
  updateBlog: async (blogId: string, data: UpdateBlogData): Promise<Blog> => {
    try {
      console.log("✏️ Updating blog:", blogId, data);

      const response = await apiClient.patch<Blog>(
        `/admin/blogs/${blogId}`,
        data
      );

      console.log("✅ Blog updated:", response.data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      console.error("❌ Update blog failed:", axiosError);
      throw error;
    }
  },

  
  deleteBlog: async (blogId: string): Promise<{ status: string }> => {
    try {
      console.log("🗑️ Deleting blog:", blogId);

      const response = await apiClient.delete<{ status: string }>(
        `/admin/blogs/${blogId}`
      );

      console.log("✅ Blog deleted:", response.data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      console.error("❌ Delete blog failed:", axiosError);
      throw error;
    }
  },
};
