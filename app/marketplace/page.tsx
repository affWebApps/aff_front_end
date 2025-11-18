"use client";
import { Search } from "@mui/icons-material";
import { useState } from "react";
import { motion } from "framer-motion";
import { CustomSelect } from "../components/CustomSelect";
import { ProductsGrid } from "../components/grid/ProductsGrid";
import { ServicesGrid } from "../components/grid/ServicesGrid";
import { Pagination } from "../components/ui/Pagination";
import HomeLayout from "../(home)/layout";

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState("products");
  const [category, setCategory] = useState("");
  const [size, setSize] = useState("");
  const [expertiseLevel, setExpertiseLevel] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const products = [
    {
      id: 1,
      image: "/images/ankara-gown.jpg",
      title: "Ready-to-wear ankara gown",
      price: "19,999",
      seller: "@sellers_username",
    },
    {
      id: 2,
      image: "/images/ankara-gown.jpg",
      title: "Leopard-skin blouse",
      price: "19,999",
      seller: "@sellers_username",
    },
    {
      id: 3,
      image: "/images/ankara-gown.jpg",
      title: "Leopard-skin blouse",
      price: "19,999",
      seller: "@sellers_username",
    },
    {
      id: 4,
      image: "/images/ankara-gown.jpg",
      title: "Leopard-skin blouse",
      price: "19,999",
      seller: "@sellers_username",
    },
    {
      id: 5,
      image: "/images/ankara-gown.jpg",
      title: "Ready-to-wear ankara gown",
      price: "19,999",
      seller: "@sellers_username",
    },
    {
      id: 6,
      image: "/images/ankara-gown.jpg",
      title: "Leopard-skin blouse",
      price: "19,999",
      seller: "@sellers_username",
    },
    {
      id: 7,
      image: "/images/ankara-gown.jpg",
      title: "Leopard-skin blouse",
      price: "19,999",
      seller: "@sellers_username",
    },
    {
      id: 8,
      image: "/images/ankara-gown.jpg",
      title: "Leopard-skin blouse",
      price: "19,999",
      seller: "@sellers_username",
    },
  ];

  const services = [
    {
      id: 1,
      image: "/images/ankara-gown.jpg",
      title: "Custom wedding gown sewing",
      description:
        "Looking for a tailor to bring to life my wedding gown which has already be patterned out",
      budget: "150,000",
      bids: "5 - 10",
    },
    {
      id: 2,
      image: "/images/ankara-gown.jpg",
      title: "Custom wedding gown sewing",
      description:
        "Looking for a tailor to bring to life my wedding gown which has already be patterned out",
      budget: "150,000",
      bids: "5 - 10",
    },
    {
      id: 3,
      image: "/images/ankara-gown.jpg",
      title: "Custom wedding gown sewing",
      description:
        "Looking for a tailor to bring to life my wedding gown which has already be patterned out",
      budget: "150,000",
      bids: "5 - 10",
    },
    {
      id: 4,
      image: "/images/ankara-gown.jpg",
      title: "Custom wedding gown sewing",
      description:
        "Looking for a tailor to bring to life my wedding gown which has already be patterned out",
      budget: "150,000",
      bids: "5 - 10",
    },
    {
      id: 5,
      image: "/images/ankara-gown.jpg",
      title: "Custom wedding gown sewing",
      description:
        "Looking for a tailor to bring to life my wedding gown which has already be patterned out",
      budget: "150,000",
      bids: "5 - 10",
    },
    {
      id: 6,
      image: "/images/ankara-gown.jpg",
      title: "Custom wedding gown sewing",
      description:
        "Looking for a tailor to bring to life my wedding gown which has already be patterned out",
      budget: "150,000",
      bids: "5 - 10",
    },
    {
      id: 7,
      image: "/images/ankara-gown.jpg",
      title: "Custom wedding gown sewing",
      description:
        "Looking for a tailor to bring to life my wedding gown which has already be patterned out",
      budget: "150,000",
      bids: "5 - 10",
    },
    {
      id: 8,
      image: "/images/ankara-gown.jpg",
      title: "Custom wedding gown sewing",
      description:
        "Looking for a tailor to bring to life my wedding gown which has already be patterned out",
      budget: "150,000",
      bids: "5 - 10",
    },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const fadeInDown = {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <HomeLayout>
      <div className="min-h-screen bg-linear-to-b from-orange-50 to-white ">
        <div className="container mx-auto px-4 py-8 ">
          <motion.h1
            className="homeH1 text-center mb-8 text-[#543A2E]"
            initial="hidden"
            animate="visible"
            variants={fadeInDown}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Fashion <span className="text-[#FAB75B]">Marketplace</span>
          </motion.h1>

          {/* Tabs */}
          <motion.div
            className="grid grid-cols-2 gap-4 max-w-2xl mx-auto mb-8"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            <button
              onClick={() => {
                setActiveTab("products");
                setCurrentPage(1);
              }}
              className={`py-4 rounded-lg font-medium transition-all ${
                activeTab === "products"
                  ? "bg-white text-gray-800 shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Products
            </button>
            <button
              onClick={() => {
                setActiveTab("services");
                setCurrentPage(1);
              }}
              className={`py-4 rounded-lg font-medium transition-all ${
                activeTab === "services"
                  ? "bg-white text-gray-800 shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Services
            </button>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            className="max-w-4xl mx-auto mb-6"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FAB75B] focus:border-transparent"
              />
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto mb-8 justify-end"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          >
            {activeTab === "products" ? (
              <>
                <div className="w-full sm:w-48">
                  <CustomSelect
                    value={category}
                    onChange={setCategory}
                    placeholder="Select category"
                    options={[
                      "Ankara Gowns",
                      "Blouses",
                      "Dresses",
                      "Accessories",
                    ]}
                  />
                </div>
                <div className="w-full sm:w-48">
                  <CustomSelect
                    value={size}
                    onChange={setSize}
                    placeholder="Choose size"
                    options={["Small", "Medium", "Large", "Extra Large"]}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="w-full sm:w-48">
                  <CustomSelect
                    value={category}
                    onChange={setCategory}
                    placeholder="Select category"
                    options={[
                      "Wedding Gowns",
                      "Custom Tailoring",
                      "Alterations",
                      "Design",
                    ]}
                  />
                </div>
                <div className="w-full sm:w-48">
                  <CustomSelect
                    value={expertiseLevel}
                    onChange={setExpertiseLevel}
                    placeholder="Select expertise level"
                    options={["Beginner", "Intermediate", "Expert", "Master"]}
                  />
                </div>
              </>
            )}
          </motion.div>

          {/* Content Grid */}
          {activeTab === "products" ? (
            <ProductsGrid products={products} />
          ) : (
            <ServicesGrid services={services} />
          )}

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={3}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </HomeLayout>
  );
}
