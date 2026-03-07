/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { CommentsModal } from "../modals/CommentsModal";
import { BlogPostView } from "./BlogPostView";
import { ArrowRight, Clock, Search, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { CustomSelect } from "../CustomSelect";
import { Pagination } from "../ui/Pagination";
import { Button } from "../ui/Button";
import { usePublishedBlogs } from "@/hooks/usePublishedBlogs";
import { Blog } from "@/services/blogService";

interface Comment {
  author: string;
  date: string;
  text: string;
  likes: number;
  replies: number;
  avatar: string;
}

interface BlogPost {
  id?: string;
  title: string;
  description: string;
  author: string;
  readTime: string;
  category: string;
  image: string;
  comments: Comment[];
}

interface BlogPostCard extends BlogPost {
  rawBlog: Blog;
}

const convertBlogToPost = (blog: Blog): BlogPostCard => {
  const description = blog.content.substring(0, 200) + "...";

  const wordCount = blog.content.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 200);

  let imageUrl = "/images/blog2.jpg";

  if (blog.images && blog.images.length > 0) {
    const primaryImage = blog.images.find((img) => img.is_primary);
    if (primaryImage && primaryImage.image_url) {
      imageUrl = primaryImage.image_url;
    } else if (blog.images[0] && blog.images[0].image_url) {
      imageUrl = blog.images[0].image_url;
    }
  }

  console.log(`Blog "${blog.title}" using image:`, imageUrl); // Debug log

  return {
    id: blog.id,
    title: blog.title,
    description,
    author: "AFF Designer",
    readTime: `${readTime} min read`,
    category: "Tech in Fashion",
    image: imageUrl,
    comments: [],
    rawBlog: blog,
  };
};

export const FashionBlogApp = () => {
  const [currentView, setCurrentView] = useState<"listing" | "post">("listing");
  const [selectedPost, setSelectedPost] = useState<BlogPostCard | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: blogs = [], isLoading, error } = usePublishedBlogs();

  const apiBlogPosts = blogs
    .filter((blog) => blog.status === "published")
    .map(convertBlogToPost);

  const fallbackBlog: Blog = {
    id: "placeholder",
    title:
      "From Sketch to Stitch: How Digital Design Is Changing Fashion Creation",
    content:
      "Discover how AFF Designer empowers creators to translate 2D patterns into real-world garments — faster, smarter, and more sustainably.",
    scheduled_for: "",
    status: "published",
    created_at: "",
    updated_at: "",
    images: [],
  };

  const featuredPost: BlogPostCard =
    apiBlogPosts[0] ||
    convertBlogToPost({
      ...fallbackBlog,
      id: "featured-fallback",
      images: [
        {
          id: "img",
          blog_id: "featured-fallback",
          image_url: "/images/blog1.png",
          is_primary: true,
        },
      ],
    });

  const blogPosts = apiBlogPosts;

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = !category || post.category === category;
    const matchesSearch =
      !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  console.log('filtered post is', filteredPosts)
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === "Popular") {
      return (b.comments?.length || 0) - (a.comments?.length || 0);
    }
    return 0;
  });

  const postsPerPage = 6;
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);
  const paginatedPosts = sortedPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const handlePostClick = (post: BlogPostCard) => {
    const matched = blogs.find((b) => b.id === post.id);
    setSelectedPost(post);
    setSelectedBlog(matched || post.rawBlog || null);
    setCurrentView("post");
  };

  const handleBackToListing = () => {
    setCurrentView("listing");
    setSelectedPost(null);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
          <div className="h-8 w-60 bg-gray-200 rounded animate-pulse" />
          <div className="grid md:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-3 animate-pulse"
              >
                <div className="h-40 w-full bg-gray-200 rounded-xl" />
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
                <div className="h-4 w-1/2 bg-gray-200 rounded" />
                <div className="h-3 w-1/3 bg-gray-200 rounded" />
                <div className="h-10 w-full bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {(error as Error).message || "Failed to load blogs"}
          </div>
        </div>
      </div>
    );
  }

  if (currentView === "post" && selectedBlog) {
    return (
      <>
        <BlogPostView
          blog={selectedBlog}
          onBack={handleBackToListing}
          onOpenComments={() => setIsCommentsModalOpen(true)}
        />
        <CommentsModal
          isOpen={isCommentsModalOpen}
          onClose={() => setIsCommentsModalOpen(false)}
          comments={selectedPost?.comments || []}
          articleTitle={selectedBlog.title}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-linear-to-br py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="homeH1 mb-4">
              Insights & Inspiration from the
              <br />
              Fashion Tech World
            </h1>
            <p className="text-gray-600">
              Explore design tips, tailoring insights, style trends, and updates
              from the AFF
              <br />
              Designer community — your go-to hub for creativity and innovation.
            </p>
          </motion.div>

          {/* Featured Post */}
          <motion.div
            className="rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative w-full h-64 md:h-full min-h-[300px]">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error(
                      "Featured image failed to load:",
                      featuredPost.image
                    );
                    e.currentTarget.src = "/images/blog1.png";
                  }}
                />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {featuredPost.title}
                </h2>
                <p className="text-gray-600 mb-4">{featuredPost.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <span>By {featuredPost.author}</span>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{featuredPost.readTime}</span>
                  </div>
                </div>
                <span className="inline-block bg-orange-50 text-[#FAB75B] px-3 py-1 rounded-full text-xs mb-6 self-start">
                  {featuredPost.category}
                </span>
                <Button
                  onClick={() => handlePostClick(featuredPost)}
                  className="flex items-center gap-2 text-white px-6 py-3 rounded-lg transition-colors self-start"
                >
                  Read Article
                  <ArrowRight size={18} />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search Bar */}
          <motion.div
            className="flex-1"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search articles, topics, authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FAB75B] focus:border-transparent"
              />
            </div>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            className="w-full md:w-48"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          >
            <CustomSelect
              value={category}
              onChange={setCategory}
              placeholder="All"
              options={[
                "Design Tips",
                "Tailoring",
                "Fabric & Materials",
                "Community Stories",
                "Tech in Fashion",
              ]}
            />
          </motion.div>

          {/* Sort Filter */}
          <motion.div
            className="w-full md:w-48"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          >
            <CustomSelect
              value={sortBy}
              onChange={setSortBy}
              placeholder="Latest"
              options={["Latest", "Popular", "Oldest"]}
            />
          </motion.div>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#FAB75B]" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
            <p className="font-medium">Error loading blogs</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Blog Posts Grid */}
        {!isLoading && !error && (
          <div className="mb-8">
            <motion.h2
              className="text-3xl font-bold text-center mb-8"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            >
              Blog <span className="text-[#FAB75B]">Posts</span>
            </motion.h2>

            {paginatedPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No blog posts found</p>
                <p className="text-gray-400 text-sm mt-2">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handlePostClick(post)}
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    transition={{
                      duration: 0.6,
                      ease: "easeOut",
                      delay: 0.3 + index * 0.1,
                    }}
                  >
                    <div className="relative w-full h-48">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error(
                            "Blog post image failed to load:",
                            post.image
                          );
                          e.currentTarget.src = "/images/blog2.jpg";
                        }}
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {post.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
                        <span>By {post.author}</span>
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                      <span className="inline-block bg-orange-50 text-[#FAB75B] px-3 py-1 rounded-full text-xs mb-4">
                        {post.category}
                      </span>
                      <button className="flex items-center gap-2 text-[#FAB75B] hover:text-[#FAB75B] font-medium text-sm transition-colors">
                        Learn More
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !error && paginatedPosts.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          >
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FashionBlogApp;
