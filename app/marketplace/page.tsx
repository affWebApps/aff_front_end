"use client";
import { Search } from "@mui/icons-material";
import { useEffect, useMemo, useState, Suspense } from "react";
import { motion } from "framer-motion";
import HomeLayout from "../(home)/layout";
import { CustomSelect } from "../../components/CustomSelect";
import { ProductsGrid } from "../../components/grid/ProductsGrid";
import { ServicesGrid } from "../../components/grid/ServicesGrid";
import { Pagination } from "../../components/ui/Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { useProducts } from "@/hooks/useProducts";
import { useAllProjects } from "@/hooks/useProjects";
import { Project } from "@/services/projectService";

export interface Product {
  id: string;
  image: string;
  title: string;
  price: number | string;
  seller: string;
}

const SERVICE_LIMIT = 12;

function MarketplaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawTab = searchParams.get("tab");
  const activeTab = rawTab === "services" ? "services" : "products";

  const rawPage = searchParams.get("page");
  const currentPage = Math.max(1, parseInt(rawPage ?? "1", 10) || 1);

  const [category, setCategory] = useState("");
  const [size, setSize] = useState("");
  const [expertiseLevel, setExpertiseLevel] = useState("");
  const [totalPages, setTotalPages] = useState<number>(1);

  const setActiveTab = (tab: string) => {
    router.replace(`/marketplace?tab=${tab}&page=1`);
  };

  const setCurrentPage = (page: number) => {
    router.replace(`/marketplace?tab=${activeTab}&page=${page}`);
  };

  const limit =
    Number.parseInt(process.env.NEXT_PUBLIC_PRODUCTS_PER_PAGE || "", 10) || 12;

  const {
    data: productsData,
    isLoading: isLoadingProducts,
    error: productsError,
  } = useProducts(currentPage, limit, { enabled: activeTab === "products" });

  const {
    data: projectsData,
    isLoading: isLoadingServices,
    error: servicesError,
  } = useAllProjects(
    activeTab === "services"
      ? { status: "OPEN", page: currentPage, limit: SERVICE_LIMIT }
      : undefined
  );

  const fetchedProducts: Product[] = useMemo(() => {
    if (!productsData?.products) return [];
    return productsData.products.map((item) => ({
      id: String(item.id),
      image: item.thumbnail || "/images/ankara-gown.jpg",
      title: item.title,
      price: item.price,
      seller: "@store",
    }));
  }, [productsData]);

  useEffect(() => {
    if (activeTab === "products" && productsData?.pagination) {
      setTotalPages(Math.max(1, Math.ceil(productsData.pagination.count / limit)));
    }
  }, [productsData, limit, activeTab]);

  useEffect(() => {
    if (activeTab === "services" && projectsData?.totalPages) {
      setTotalPages(Math.max(1, projectsData.totalPages));
    }
  }, [projectsData, activeTab]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const fadeInDown = {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0 },
  };

  const handleProductClick = (product: Product) => {
    router.push(`/marketplace/products/${product.id}`);
  };

  const handleServiceClick = (project: Project) => {
    router.push(`/marketplace/services/${project.id}`);
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
              onClick={() => setActiveTab("products")}
              className={`py-4 rounded-lg font-medium transition-all ${activeTab === "products"
                ? "bg-white text-gray-800 shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab("services")}
              className={`py-4 rounded-lg font-medium transition-all ${activeTab === "services"
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
                    options={["Ankara Gowns", "Blouses", "Dresses", "Accessories"]}
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
                    options={["Wedding Gowns", "Custom Tailoring", "Alterations", "Design"]}
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

          {/* Errors */}
          {productsError && activeTab === "products" && (
            <div className="max-w-4xl mx-auto mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {productsError instanceof Error ? productsError.message : String(productsError)}
            </div>
          )}
          {servicesError && activeTab === "services" && (
            <div className="max-w-4xl mx-auto mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {servicesError instanceof Error ? servicesError.message : String(servicesError)}
            </div>
          )}

          {/* Content Grid */}
          {activeTab === "products" ? (
            isLoadingProducts ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl shadow-md p-4 space-y-3 animate-pulse"
                  >
                    <div className="aspect-square bg-gray-200 rounded-lg" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : (
              <ProductsGrid products={fetchedProducts} onProductClick={handleProductClick} />
            )
          ) : isLoadingServices ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto mb-12">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg shadow-md overflow-hidden flex animate-pulse"
                >
                  <div className="w-40 shrink-0 bg-gray-200" />
                  <div className="p-4 flex-1 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ServicesGrid
              services={projectsData?.data ?? []}
              onServiceClick={handleServiceClick}
            />
          )}

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </HomeLayout>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense>
      <MarketplaceContent />
    </Suspense>
  );
}
