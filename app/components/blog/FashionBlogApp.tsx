"use client";

import { useState } from "react";
import { CommentsModal } from "../modals/CommentsModal";
import { BlogPostView } from "./BlogPostView";
import { ArrowRight, Clock, Search } from "lucide-react";

import { motion } from "framer-motion";
import { CustomSelect } from "../CustomSelect";
import { Pagination } from "../ui/Pagination";
import Image from "next/image";
import { Button } from "../ui/Button";

interface Comment {
  author: string;
  date: string;
  text: string;
  likes: number;
  replies: number;
  avatar: string;
}

interface BlogPost {
  id?: number;
  title: string;
  description: string;
  author: string;
  readTime: string;
  category: string;
  image: string;
  comments: Comment[];
}

export const FashionBlogApp = () => {
  const [currentView, setCurrentView] = useState<"listing" | "post">("listing");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "5 Common Fitting Mistakes — and How to Fix Them",
      description:
        "From sleeve alignment to waist adjustments, learn simple fixes that make every outfit look professionally made.",
      author: "Tolu Adebayo",
      readTime: "4 min read",
      category: "Tailoring",
      image: "/images/blog2.jpg",
      comments: [
        {
          author: "Marie Desmond",
          date: "Jan 12, 2024",
          text: "This was such an insightful read! I've been experimenting with CLO 3D lately, and it's amazing how much easier it makes the design process. Totally agree that digital tools are the future of fashion.",
          likes: 5,
          replies: 0,
          avatar: "/api/placeholder/40/40",
        },
        {
          author: "Daniel K.",
          date: "2 days ago",
          text: "I love how digital design bridges the gap between designers and tailors. Receiving digital patterns saves me so much time — no more confusion with sketches or handwritten notes.",
          likes: 1,
          replies: 0,
          avatar: "/api/placeholder/40/40",
        },
      ],
    },
    {
      id: 2,
      title: "Choosing the Right Fabric for Every Design",
      description:
        "Cotton, linen, or silk? Discover how different fabrics behave and how to visualize them perfectly in the AFF Designer studio.",
      author: "Ezra Yusuf",
      readTime: "6 min read",
      category: "Fabric & Materials",
      image: "/images/blog2.jpg",
      comments: [],
    },
    {
      id: 3,
      title: "Meet the Tailors Behind AFF Designer's Early Success",
      description:
        "Tailors across Africa are finding new clients and collaborations through AFF Designer — see how they're redefining fashion entrepreneurship.",
      author: "Efianayi Tsan",
      readTime: "3 min read",
      category: "Community Stories",
      image: "/images/blog2.jpg",
      comments: [],
    },
    {
      id: 4,
      title: "Why Digital Patternmaking Is the Future of Tailoring",
      description:
        "See how parametric design tools like AFF Designer bridge the gap between creative concept and real-world precision.",
      author: "Chika Onu",
      readTime: "5 min read",
      category: "Tech in Fashion",
      image: "/images/blog2.jpg",
      comments: [],
    },
    {
      id: 5,
      title: "Why Digital Patternmaking Is the Future of Tailoring",
      description:
        "See how parametric design tools like AFF Designer bridge the gap between creative concept and real-world precision.",
      author: "Chika Onu",
      readTime: "3 min read",
      category: "Tech in Fashion",
      image: "/images/blog2.jpg",
      comments: [],
    },
    {
      id: 6,
      title: "Why Digital Patternmaking Is the Future of Tailoring",
      description:
        "See how parametric design tools like AFF Designer bridge the gap between creative concept and real-world precision.",
      author: "Chika Onu",
      readTime: "1 min read",
      category: "Tech in Fashion",
      image: "/images/blog2.jpg",
      comments: [],
    },
  ];

  const featuredPost: BlogPost = {
    title:
      "From Sketch to Stitch: How Digital Design Is Changing Fashion Creation",
    description:
      "Discover how AFF Designer empowers creators to translate 2D patterns into real-world garments — faster, smarter, and more sustainably.",
    author: "Adaora James",
    readTime: "5 min read",
    category: "Design Tips",
    image: "/images/blog1.png",
    comments: [
      {
        author: "Marie Desmond",
        date: "Jan 12, 2024",
        text: "This was such an insightful read! I've been experimenting with CLO 3D lately, and it's amazing how much easier it makes the design process. Totally agree that digital tools are the future of fashion.",
        likes: 5,
        replies: 0,
        avatar: "/api/placeholder/40/40",
      },
      {
        author: "Daniel K.",
        date: "2 days ago",
        text: "I love how digital design bridges the gap between designers and tailors. Receiving digital patterns saves me so much time — no more confusion with sketches or handwritten notes.",
        likes: 1,
        replies: 0,
        avatar: "/api/placeholder/40/40",
      },
    ],
  };

  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post);
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

  if (currentView === "post" && selectedPost) {
    return (
      <>
        <BlogPostView
          post={selectedPost}
          onBack={handleBackToListing}
          onOpenComments={() => setIsCommentsModalOpen(true)}
        />
        <CommentsModal
          isOpen={isCommentsModalOpen}
          onClose={() => setIsCommentsModalOpen(false)}
          comments={selectedPost.comments}
          articleTitle={selectedPost.title}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen ">
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
            className="rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            <div className="grid md:grid-cols-2 gap-0">
              <Image
                src={featuredPost.image}
                alt={featuredPost.title}
                className="w-full h-full object-cover"
                width={400}
                height={400}
              />
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

        {/* Blog Posts Grid */}
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post, index) => (
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
                <Image
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                  width={400}
                  height={400}
                />
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
        </div>

        {/* Pagination */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
        >
          <Pagination
            currentPage={currentPage}
            totalPages={3}
            onPageChange={setCurrentPage}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default FashionBlogApp;
