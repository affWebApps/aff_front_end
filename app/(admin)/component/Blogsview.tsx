/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBlogStore } from "@/store/blogStore";
import type { Blog } from "@/services/blogService";

type ModalMode = "create" | "edit" | "delete" | null;

interface FormData {
  title: string;
  content: string;
  status: "draft" | "scheduled" | "published";
  scheduledFor: string;
  imageFile: File | null;
}

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "published":
      return "bg-emerald-100 text-emerald-700";
    case "draft":
      return "bg-amber-100 text-amber-700";
    case "scheduled":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const BlogFormModal = ({
  mode,
  blog,
  onClose,
  onSubmit,
}: {
  mode: "create" | "edit";
  blog: Blog | null;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
}) => {
  const [form, setForm] = useState<FormData>({
    title: blog?.title ?? "",
    content: blog?.content ?? "",
    status: blog?.status ?? "draft",
    scheduledFor: blog?.scheduled_for ? blog.scheduled_for.slice(0, 10) : "",
    imageFile: null,
  });

  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    blog?.images?.[0]?.image_url ?? null
  );
  const fileRef = useRef<HTMLInputElement>(null);

  const change = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({ ...prev, imageFile: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setForm((prev) => ({ ...prev, imageFile: null }));
    setImagePreview(null);
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.content.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit(form);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {mode === "create" ? "Create New Blog Post" : "Edit Blog Post"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 pb-6 space-y-5 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Title
            </label>
            <input
              name="title"
              value={form.title}
              onChange={change}
              placeholder="Enter blog title…"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Content
            </label>
            <textarea
              name="content"
              value={form.content}
              onChange={change}
              rows={5}
              placeholder="Write your blog content here…"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm resize-y focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition"
            />
            <p className="text-xs text-gray-400 mt-1">
              {form.content.length} characters
            </p>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={change}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition appearance-none cursor-pointer"
              >
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="published">Published</option>
              </select>
            </div>

            {form.status === "scheduled" && (
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Scheduled For
                </label>
                <input
                  type="date"
                  name="scheduledFor"
                  value={form.scheduledFor}
                  onChange={change}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Cover Image
            </label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            {imagePreview ? (
              <div className="relative rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={imagePreview}
                  alt="preview"
                  className="w-full h-40 object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-lg shadow"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-amber-400 hover:text-amber-500 transition-colors"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span className="text-sm">Click to upload image</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || !form.title.trim() || !form.content.trim()}
            className="px-6 py-2.5 bg-amber-400 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            {submitting && (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {mode === "create" ? "Publish Post" : "Save Changes"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const DeleteConfirmModal = ({
  blog,
  onClose,
  onConfirm,
}: {
  blog: Blog;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) => {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onConfirm();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-xl p-6"
      >
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#dc2626"
              strokeWidth="2"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </div>
        </div>

        <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
          Delete Blog Post?
        </h3>
        <p className="text-sm text-gray-500 text-center mb-1">
          You are about to delete
        </p>
        <p className="text-sm font-semibold text-gray-800 text-center mb-5 truncate px-4">
          &quot;{blog.title}&quot;
        </p>
        <p className="text-xs text-gray-400 text-center mb-6">
          This action cannot be undone. The post will be permanently removed.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={deleting}
            className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {deleting && (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            Delete Post
          </button>
        </div>
      </motion.div>
    </div>
  );
};

interface BlogsViewProps {
  onBack: () => void;
}

export default function BlogsView({ onBack }: BlogsViewProps) {
  const {
    blogs,
    isLoading,
    error,
    fetchBlogs,
    createBlog,
    updateBlog,
    deleteBlog,
    clearError,
  } = useBlogStore();

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  useEffect(() => {
    fetchBlogs();
    return () => clearError();
  }, [fetchBlogs, clearError]);

  const categories = ["All", "Published", "Draft", "Scheduled"];

  const filteredBlogs = blogs.filter((b) => {
    if (selectedCategory === "All") return true;
    return b.status === selectedCategory.toLowerCase();
  });

  const handleCreate = async (form: FormData) => {
    const imageFiles = form.imageFile ? [form.imageFile] : undefined;
    await createBlog(
      {
        title: form.title,
        content: form.content,
        status: form.status,
        scheduledFor: form.scheduledFor || undefined,
      },
      imageFiles
    );
    setModalMode(null);
  };

  const handleUpdate = async (form: FormData) => {
    if (!selectedBlog) return;
    const imageFiles = form.imageFile ? [form.imageFile] : undefined;
    await updateBlog(
      selectedBlog.id,
      {
        title: form.title,
        content: form.content,
        status: form.status,
        scheduledFor: form.scheduledFor || undefined,
      },
      imageFiles
    );
    setModalMode(null);
    setSelectedBlog(null);
  };

  const handleDelete = async () => {
    if (!selectedBlog) return;
    await deleteBlog(selectedBlog.id);
    setModalMode(null);
    setSelectedBlog(null);
  };

  const openCreate = () => {
    setSelectedBlog(null);
    setModalMode("create");
  };

  const openEdit = (blog: Blog) => {
    setSelectedBlog(blog);
    setModalMode("edit");
  };

  const openDelete = (blog: Blog) => {
    setSelectedBlog(blog);
    setModalMode("delete");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="px-6 py-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M12.5 15L7.5 10L12.5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 font-montserrat">
                Blog Posts
              </h1>
              <p className="text-gray-600">
                Create and manage blog articles across different categories
              </p>
            </div>
            <button
              onClick={openCreate}
              className="bg-amber-400 hover:bg-amber-500 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <span className="text-xl leading-none">+</span>
              Post New Blog
            </button>
          </div>
        </div>

        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full whitespace-nowrap text-sm transition-all ${
                selectedCategory === cat
                  ? "bg-stone-800 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4 animate-pulse"
              >
                <div className="h-48 w-full bg-gray-200 rounded-xl" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="flex gap-2">
                  <div className="h-8 w-20 bg-gray-200 rounded-full" />
                  <div className="h-8 w-16 bg-gray-200 rounded-full" />
                </div>
                <div className="h-10 w-full bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBlogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <img
                  src={
                    blog.images?.length > 0
                      ? blog.images[0].image_url
                      : "/images/blog2.jpg"
                  }
                  alt={blog.title}
                  className="w-full h-36 object-cover rounded-lg mb-4 mx-0"
                  onError={(e) => {
                    console.error(
                      "Blog image failed to load:",
                      blog.images?.[0]?.image_url || "no image"
                    );
                    e.currentTarget.src = "/images/blog2.jpg";
                  }}
                />

                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  {blog.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                  {blog.content}
                </p>
                <p className="text-xs text-gray-400 mb-4">
                  {new Date(blog.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                  {blog.status === "scheduled" && blog.scheduled_for && (
                    <span className="ml-2">
                      · Scheduled for{" "}
                      {new Date(blog.scheduled_for).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </span>
                  )}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                      blog.status
                    )}`}
                  >
                    {capitalize(blog.status)}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(blog)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => openDelete(blog)}
                      className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && !error && filteredBlogs.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-300 mb-4">
              <svg
                className="mx-auto h-16 w-16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {selectedCategory === "All"
                ? "No blog posts yet"
                : `No ${selectedCategory.toLowerCase()} posts`}
            </h3>
            <p className="text-gray-500 text-sm mb-5">
              {selectedCategory === "All"
                ? "Get started by creating your first blog post."
                : `There are no posts with the "${selectedCategory.toLowerCase()}" status right now.`}
            </p>
            {selectedCategory === "All" && (
              <button
                onClick={openCreate}
                className="bg-amber-400 hover:bg-amber-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                Create a Post
              </button>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {modalMode === "create" && (
          <BlogFormModal
            mode="create"
            blog={null}
            onClose={() => setModalMode(null)}
            onSubmit={handleCreate}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modalMode === "edit" && selectedBlog && (
          <BlogFormModal
            mode="edit"
            blog={selectedBlog}
            onClose={() => {
              setModalMode(null);
              setSelectedBlog(null);
            }}
            onSubmit={handleUpdate}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modalMode === "delete" && selectedBlog && (
          <DeleteConfirmModal
            blog={selectedBlog}
            onClose={() => {
              setModalMode(null);
              setSelectedBlog(null);
            }}
            onConfirm={handleDelete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
