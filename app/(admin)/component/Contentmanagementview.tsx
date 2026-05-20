"use client";
import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, FileText, Users, ArrowLeft, Save } from "lucide-react";
import BlogsView from "./Blogsview";
import UsersView from "./Userview";
import { blogService } from "@/services/blogService";
import { teamMemberService } from "@/services/teamMemberService";
import { siteContentService } from "@/services/siteContentService";
import { useUpdateSiteContent } from "@/hooks/useSiteContent";

const EDITOR_SECTIONS = ["about-us", "our-story", "our-mission", "our-vision"] as const;
type EditorSection = (typeof EDITOR_SECTIONS)[number];

type SectionParam = "blogs" | "team" | EditorSection;

function ContentManagementSystemInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const rawSection = searchParams.get("section");
  const validSections: string[] = ["blogs", "team", ...EDITOR_SECTIONS];
  const currentSection: SectionParam | null =
    rawSection && validSections.includes(rawSection)
      ? (rawSection as SectionParam)
      : null;

  const [editData, setEditData] = useState<Record<string, string>>({});
  const [saveError, setSaveError] = useState("");

  const { data: blogs } = useQuery({
    queryKey: ["admin-blogs"],
    queryFn: blogService.getAllBlogs,
    staleTime: 60_000,
  });

  const { data: teamMembers } = useQuery({
    queryKey: ["team-members", false],
    queryFn: () => teamMemberService.getAll(),
    staleTime: 60_000,
  });

  const blogPreview = blogs
    ? `${blogs.length} total · ${blogs.filter((b) => b.status === "published").length} published · ${blogs.filter((b) => b.status === "scheduled").length} scheduled · ${blogs.filter((b) => b.status === "draft").length} drafts`
    : "Loading…";

  const { data: aboutUsApi } = useQuery({ queryKey: ["site-content", "about_us"], queryFn: () => siteContentService.getByKey("about_us"), staleTime: 60_000, retry: false });
  const { data: ourStoryApi } = useQuery({ queryKey: ["site-content", "our_story"], queryFn: () => siteContentService.getByKey("our_story"), staleTime: 60_000, retry: false });
  const { data: ourMissionApi } = useQuery({ queryKey: ["site-content", "our_mission"], queryFn: () => siteContentService.getByKey("our_mission"), staleTime: 60_000, retry: false });
  const { data: ourVisionApi } = useQuery({ queryKey: ["site-content", "our_vision"], queryFn: () => siteContentService.getByKey("our_vision"), staleTime: 60_000, retry: false });

  const contentData: Record<string, { title: string; content: string }> = {
    "about-us": {
      title: "About Us",
      content: aboutUsApi?.body ||
        "African Fashion Fusion is a revolutionary digital platform connecting skilled African tailors with fashion enthusiasts who create their designs worldwide. We blend traditional African craftsmanship with contemporary design through our innovative online marketplace and custom design tools.",
    },
    "our-story": {
      title: "Our Story",
      content: ourStoryApi?.body ||
        "African Fashion Fusion emerged from a passion to merge the vibrant heritage of African fashion with global trends. Originating from The heart of nigeria, we partner with skilled artisans across Africa to create contemporary garments that honor traditional craftsmanship. Our brand aims to share the rich stories embedded in each piece, celebrating cultural diversity and empowering local communities. We believe fashion is a powerful bridge between cultures, and through our designs, we invite you to experience the authentic beauty and timeless elegance of African style.",
    },
    "our-mission": {
      title: "Our Mission",
      content: ourMissionApi?.body ||
        "We partner with skilled artisans across Africa to create contemporary garments that honor traditional craftsmanship. Our brand aims to share the rich stories embedded in each piece, celebrating cultural diversity and empowering local communities. We believe fashion is a powerful bridge between cultures, and through our designs, we invite you to experience the authentic beauty and timeless elegance of African style.",
    },
    "our-vision": {
      title: "Our Vision",
      content: ourVisionApi?.body ||
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
      preview: teamMembers ? `${teamMembers.length} team members` : "Loading…",
    },
    {
      id: "blog-posts",
      title: "Blog Posts",
      icon: FileText,
      time: "1 week ago",
      preview: blogPreview,
    },
  ];

  const navigateToSection = (section: SectionParam, extraData?: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("section", section);
    if (extraData) {
      setEditData(extraData);
    }
    router.push(`?${params.toString()}`);
  };

  const handleCardClick = (id: string) => {
    if (id === "blog-posts") {
      navigateToSection("blogs");
      return;
    }
    if (id === "team-members") {
      navigateToSection("team");
      return;
    }
    // it's an editor section
    navigateToSection(id as EditorSection, { [id]: contentData[id].content });
  };

  const handleBack = () => {
    setSaveError("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("section");
    router.push(`?${params.toString()}`);
  };

  const updateSiteContent = useUpdateSiteContent();

  const handleContentChange = (id: string, value: string) =>
    setEditData((prev) => ({ ...prev, [id]: value }));

  const handleSave = async () => {
    if (!currentSection || currentSection === "blogs" || currentSection === "team") return;
    setSaveError("");
    const apiKey = currentSection.replace(/-/g, "_");
    try {
      await updateSiteContent.mutateAsync({ key: apiKey, data: { body: editData[currentSection] } });
      handleBack();
    } catch {
      setSaveError("Failed to publish changes. Please try again.");
    }
  };

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

  const isEditorSection =
    currentSection !== null &&
    currentSection !== "blogs" &&
    currentSection !== "team";

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {currentSection === "blogs" && (
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

          {currentSection === "team" && (
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

          {currentSection === null && (
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
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {isEditorSection && (
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
                  {contentData[currentSection]?.title}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Edit the {contentData[currentSection]?.title.toLowerCase()}{" "}
                  section of your website
                </p>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Edit Content
                  </label>
                  <textarea
                    value={editData[currentSection] ?? contentData[currentSection]?.content ?? ""}
                    onChange={(e) =>
                      handleContentChange(currentSection, e.target.value)
                    }
                    className="w-full min-h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-y"
                    placeholder="Enter your content here..."
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    {(editData[currentSection] ?? contentData[currentSection]?.content ?? "").length} characters
                  </p>
                </div>

                {saveError && (
                  <p className="text-sm text-red-600 mb-3 text-right">{saveError}</p>
                )}
                <div className="flex gap-3 justify-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={updateSiteContent.isPending}
                    className="px-6 py-2.5 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors font-medium flex items-center gap-2 disabled:opacity-60"
                  >
                    <Save size={18} />
                    {updateSiteContent.isPending ? "Publishing…" : "Publish Changes"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const ContentManagementSystem = () => (
  <Suspense fallback={<div className="min-h-screen bg-white" />}>
    <ContentManagementSystemInner />
  </Suspense>
);

export default ContentManagementSystem;
