import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, Trash2, FileText, Users, ArrowLeft, Save } from "lucide-react";
import BlogsView from "./Blogsview";
import UsersView from "./Userview";

type ViewState = null | "blogs" | "users" | string;

const ContentManagementSystem = () => {
  const [currentView, setCurrentView] = useState<ViewState>(null);
  const [editData, setEditData] = useState<Record<string, string>>({});

  const contentData: Record<string, { title: string; content: string }> = {
    "about-us": {
      title: "About Us",
      content:
        "African Fashion Fusion is a revolutionary digital platform connecting skilled African tailors with fashion enthusiasts who create their designs worldwide. We blend traditional African craftsmanship with contemporary design through our innovative online marketplace and custom design tools.",
    },
    "our-story": {
      title: "Our Story",
      content:
        "African Fashion Fusion emerged from a passion to merge the vibrant heritage of African fashion with global trends. Originating from The heart of nigeria, we partner with skilled artisans across Africa to create contemporary garments that honor traditional craftsmanship. Our brand aims to share the rich stories embedded in each piece, celebrating cultural diversity and empowering local communities. We believe fashion is a powerful bridge between cultures, and through our designs, we invite you to experience the authentic beauty and timeless elegance of African style.",
    },
    "our-mission": {
      title: "Our Mission",
      content:
        "We partner with skilled artisans across Africa to create contemporary garments that honor traditional craftsmanship. Our brand aims to share the rich stories embedded in each piece, celebrating cultural diversity and empowering local communities. We believe fashion is a powerful bridge between cultures, and through our designs, we invite you to experience the authentic beauty and timeless elegance of African style.",
    },
    "our-vision": {
      title: "Our Vision",
      content:
        "We believe fashion is a powerful bridge between cultures, and through our designs, we invite you to experience the authentic beauty and timeless elegance of African style. Our vision is to become the leading platform for African fashion globally.",
    },
  };

  const contentCards = [
    {
      id: "about-us",
      title: "About Us",
      icon: FileText,
      time: "2 hours ago",
      preview: contentData["about-us"].content.substring(0, 100) + "...",
    },
    {
      id: "our-story",
      title: "Our Story",
      icon: FileText,
      time: "5 hours ago",
      preview: contentData["our-story"].content.substring(0, 100) + "...",
    },
    {
      id: "our-mission",
      title: "Our Mission",
      icon: FileText,
      time: "5 days ago",
      preview: contentData["our-mission"].content.substring(0, 100) + "...",
    },
    {
      id: "our-vision",
      title: "Our Vision",
      icon: FileText,
      time: "7 days ago",
      preview: contentData["our-vision"].content.substring(0, 100) + "...",
    },
    {
      id: "team-members",
      title: "Team Members",
      icon: Users,
      time: "2 hours ago",
      preview: "5 Team members added",
    },
    {
      id: "blog-posts",
      title: "Blog Posts",
      icon: FileText,
      time: "1 week ago",
      preview: "6 Blogs online",
    },
  ];

  const handleCardClick = (id: string) => {
    if (id === "blog-posts") {
      setCurrentView("blogs");
      return;
    }
    if (id === "team-members") {
      setCurrentView("users");
      return;
    }
    setCurrentView(id);
    setEditData({ [id]: contentData[id].content });
  };

  const handleBack = () => setCurrentView(null);
  const handleContentChange = (id: string, value: string) =>
    setEditData((prev) => ({ ...prev, [id]: value }));
  const handleSave = () => alert("Changes saved successfully!");
  const handleSaveDraft = () => alert("Draft saved successfully!");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    hover: { y: -5, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {currentView === "blogs" && (
            <motion.div
              key="blogs"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <BlogsView onBack={handleBack} />
            </motion.div>
          )}

          {currentView === "users" && (
            <motion.div
              key="users"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <UsersView onBack={handleBack} />
            </motion.div>
          )}

          {currentView === null && (
            <motion.div
              key="list"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <motion.h2
                variants={itemVariants}
                className="text-xl font-medium text-gray-900 mb-1"
              >
                Website Content
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="text-gray-600 text-sm mb-8"
              >
                Edit core website pages and information
              </motion.p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contentCards.map((card) => (
                  <motion.div
                    key={card.id}
                    variants={cardVariants}
                    whileHover="hover"
                    className="bg-white rounded-lg border border-gray-200 p-6 cursor-pointer shadow-sm"
                    onClick={() => handleCardClick(card.id)}
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <motion.div
                        whileHover={{ rotate: 5 }}
                        className="bg-gray-100 p-2 rounded"
                      >
                        <card.icon size={20} className="text-gray-600" />
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {card.title}
                        </h3>
                        <p className="text-xs text-gray-400">{card.time}</p>
                      </div>
                    </div>
                    <p
                      className="text-sm text-gray-600 mb-4 overflow-hidden"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {card.preview}
                    </p>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardClick(card.id);
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
                          if (
                            confirm(
                              `Are you sure you want to delete ${card.title}?`
                            )
                          )
                            alert(`${card.title} deleted`);
                        }}
                        className="p-2 hover:bg-gray-100 rounded transition-colors"
                      >
                        <Trash2 size={18} className="text-gray-600" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {currentView !== null &&
            currentView !== "blogs" &&
            currentView !== "users" && (
              <motion.div
                key="edit"
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
                    <span>Back</span>
                  </button>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {contentData[currentView]?.title}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Edit the {contentData[currentView]?.title.toLowerCase()}{" "}
                    section of your website
                  </p>
                </div>

                <div className="p-6">
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Edit Content
                    </label>
                    <textarea
                      value={editData[currentView] || ""}
                      onChange={(e) =>
                        handleContentChange(currentView, e.target.value)
                      }
                      className="w-full min-h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-y"
                      placeholder="Enter your content here..."
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      {editData[currentView]?.length || 0} characters
                    </p>
                  </div>

                  <div className="flex gap-3 justify-end">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSaveDraft}
                      className="px-6 py-2.5 border border-orange-400 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors font-medium"
                    >
                      Save to Draft
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSave}
                      className="px-6 py-2.5 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors font-medium flex items-center gap-2"
                    >
                      <Save size={18} />
                      Publish Changes
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ContentManagementSystem;
