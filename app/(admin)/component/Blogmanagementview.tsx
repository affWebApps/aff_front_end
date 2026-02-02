/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit2,
  Trash2,
  FileText,
  ArrowLeft,
  Save,
  Plus,
  Calendar,
  Eye,
} from "lucide-react";
import {
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { useBlogStore } from "@/store/blogStore";
import { CreateBlogData, UpdateBlogData } from "@/services/blogService";

const BlogManagementView = () => {
  const {
    blogs,
    currentBlog,
    isLoading,
    error,
    fetchBlogs,
    createBlog,
    updateBlog,
    deleteBlog,
    setCurrentBlog,
    clearError,
  } = useBlogStore();

  const [currentView, setCurrentView] = useState<"list" | "create" | "edit">(
    "list"
  );
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    status: "draft" as "draft" | "scheduled" | "published",
    scheduledFor: "",
    images: [] as Array<{ imageUrl: string; isPrimary: boolean }>,
  });
  const [newImageUrl, setNewImageUrl] = useState("");

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });

  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    blogId: "",
    blogTitle: "",
  });

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "warning" | "info" = "success"
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Fetch blogs on mount
  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleCardClick = (blogId: string) => {
    const blog = blogs.find((b) => b.id === blogId);
    if (blog) {
      setCurrentBlog(blog);
      // Set form data when editing
      setFormData({
        title: blog.title,
        content: blog.content,
        status: blog.status,
        scheduledFor: blog.scheduled_for || "",
        images: blog.images.map((img) => ({
          imageUrl: img.image_url,
          isPrimary: img.is_primary,
        })),
      });
      setCurrentView("edit");
    }
  };

  const handleBack = () => {
    setCurrentView("list");
    setCurrentBlog(null);
    clearError();
  };

  const handleCreateNew = () => {
    setFormData({
      title: "",
      content: "",
      status: "draft",
      scheduledFor: "",
      images: [],
    });
    setCurrentBlog(null);
    setCurrentView("create");
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setFormData({
        ...formData,
        images: [
          ...formData.images,
          { imageUrl: newImageUrl, isPrimary: formData.images.length === 0 },
        ],
      });
      setNewImageUrl("");
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    // If we removed the primary image, make the first one primary
    if (formData.images[index].isPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true;
    }
    setFormData({ ...formData, images: newImages });
  };

  const handleSetPrimaryImage = (index: number) => {
    const newImages = formData.images.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    setFormData({ ...formData, images: newImages });
  };

  const handleSave = async () => {
    try {
      const data: CreateBlogData | UpdateBlogData = {
        title: formData.title,
        content: formData.content,
        status: formData.status,
        ...(formData.scheduledFor && { scheduledFor: formData.scheduledFor }),
        ...(formData.images.length > 0 && { images: formData.images }),
      };

      if (currentView === "create") {
        await createBlog(data as CreateBlogData);
        showSnackbar("Blog created successfully!", "success");
      } else if (currentView === "edit" && currentBlog) {
        await updateBlog(currentBlog.id, data);
        showSnackbar("Blog updated successfully!", "success");
      }

      handleBack();
    } catch (error) {
      console.error("Save failed:", error);
      showSnackbar("Failed to save blog. Please try again.", "error");
    }
  };

  const handleDelete = async (blogId: string, blogTitle: string) => {
    setDeleteModal({ open: true, blogId, blogTitle });
  };

  const confirmDelete = async () => {
    try {
      await deleteBlog(deleteModal.blogId);
      showSnackbar("Blog deleted successfully!", "success");
      setDeleteModal({ open: false, blogId: "", blogTitle: "" });
    } catch (error) {
      console.error("Delete failed:", error);
      showSnackbar("Failed to delete blog. Please try again.", "error");
      setDeleteModal({ open: false, blogId: "", blogTitle: "" });
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ open: false, blogId: "", blogTitle: "" });
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      draft: "bg-gray-100 text-gray-800",
      scheduled: "bg-blue-100 text-blue-800",
      published: "bg-green-100 text-green-800",
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    },
    hover: {
      y: -5,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {currentView === "list" ? (
            <motion.div
              key="list"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back</span>
              </button>

              <div className="flex justify-between items-center mb-8">
                <div>
                  <motion.h2
                    variants={itemVariants}
                    className="text-xl font-medium text-gray-900 mb-1"
                  >
                    Blog Posts
                  </motion.h2>
                  <motion.p
                    variants={itemVariants}
                    className="text-gray-600 text-sm"
                  >
                    Create and manage blog articles across different categories
                  </motion.p>
                </div>
                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreateNew}
                  className="px-6 py-2.5 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors font-medium flex items-center gap-2"
                >
                  <Plus size={18} />
                  Post New Blog
                </motion.button>
              </div>

              {error && (
                <motion.div
                  variants={itemVariants}
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
                >
                  {error}
                </motion.div>
              )}

              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400"></div>
                </div>
              ) : blogs.length === 0 ? (
                <motion.div
                  variants={itemVariants}
                  className="text-center py-12 text-gray-500"
                >
                  <FileText size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No blog posts yet. Create your first one!</p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {blogs.map((blog) => (
                    <motion.div
                      key={blog.id}
                      variants={cardVariants}
                      whileHover="hover"
                      className="bg-white rounded-lg border border-gray-200 p-6 cursor-pointer shadow-sm"
                      onClick={() => handleCardClick(blog.id)}
                    >
                      <div className="flex items-start gap-3 mb-4">
                        <motion.div
                          whileHover={{ rotate: 5 }}
                          className="bg-gray-100 p-2 rounded"
                        >
                          <FileText size={20} className="text-gray-600" />
                        </motion.div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 line-clamp-1">
                            {blog.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`text-xs px-2 py-1 rounded ${getStatusBadge(
                                blog.status
                              )}`}
                            >
                              {blog.status}
                            </span>
                            {blog.scheduled_for && (
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Calendar size={12} />
                                {formatDate(blog.scheduled_for)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div
                        className="text-sm text-gray-600 mb-4 line-clamp-3"
                        dangerouslySetInnerHTML={{
                          __html: blog.content.substring(0, 150) + "...",
                        }}
                      />
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{formatDate(blog.created_at)}</span>
                        {blog.images.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Eye size={12} />
                            {blog.images.length} image
                            {blog.images.length !== 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick(blog.id);
                          }}
                          className="p-2 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Edit2 size={18} className="text-gray-600" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(blog.id, blog.title);
                          }}
                          className="p-2 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Trash2 size={18} className="text-gray-600" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-sm"
            >
              <div className="p-6 border-b border-gray-200">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                >
                  <ArrowLeft size={20} />
                  <span>Back to Blogs</span>
                </button>

                <h2 className="text-2xl font-bold text-gray-900">
                  {currentView === "create"
                    ? "Create New Blog Post"
                    : "Edit Blog Post"}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {currentView === "create"
                    ? "Fill in the details to create a new blog post"
                    : "Update the blog post information"}
                </p>
              </div>

              <div className="p-6 space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blog Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    placeholder="Enter blog title..."
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    className="w-full min-h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-y"
                    placeholder="Enter blog content (HTML supported)..."
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    {formData.content.length} characters • HTML tags supported
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as
                            | "draft"
                            | "scheduled"
                            | "published",
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    >
                      <option value="draft">Draft</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="published">Published</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Schedule For (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.scheduledFor}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          scheduledFor: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blog Images
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="url"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      placeholder="Enter image URL..."
                    />
                    <button
                      onClick={handleAddImage}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Add Image
                    </button>
                  </div>

                  {formData.images.length > 0 && (
                    <div className="space-y-2">
                      {formData.images.map((img, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <img
                            src={img.imageUrl}
                            alt=""
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1 truncate text-sm text-gray-600">
                            {img.imageUrl}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSetPrimaryImage(index)}
                              className={`px-3 py-1 text-xs rounded ${
                                img.isPrimary
                                  ? "bg-orange-400 text-white"
                                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                              }`}
                            >
                              {img.isPrimary ? "Primary" : "Set Primary"}
                            </button>
                            <button
                              onClick={() => handleRemoveImage(index)}
                              className="p-1 hover:bg-red-100 rounded transition-colors"
                            >
                              <Trash2 size={16} className="text-red-600" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                  </div>
                )}

                <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleBack}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={isLoading || !formData.title || !formData.content}
                    className="px-6 py-2.5 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save size={18} />
                    {isLoading
                      ? "Saving..."
                      : currentView === "create"
                      ? "Publish Blog"
                      : "Update Blog"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Dialog
        open={deleteModal.open}
        onClose={cancelDelete}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 400,
          },
        }}
      >
        <DialogTitle id="delete-dialog-title" sx={{ fontWeight: 600 }}>
          Delete Blog Post
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete{" "}
            <strong>&quot;{deleteModal.blogTitle}&quot;</strong>? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={cancelDelete}
            variant="outlined"
            sx={{
              color: "gray",
              borderColor: "#d1d5db",
              "&:hover": {
                borderColor: "#9ca3af",
                backgroundColor: "#f9fafb",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            color="error"
            disabled={isLoading}
            sx={{
              backgroundColor: "#ef4444",
              "&:hover": {
                backgroundColor: "#dc2626",
              },
            }}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default BlogManagementView;
