"use client";
import { Search } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import HomeLayout from "../(home)/layout";
import { CustomSelect } from "../../components/CustomSelect";
import { ProductsGrid } from "../../components/grid/ProductsGrid";
import { ServicesGrid } from "../../components/grid/ServicesGrid";
import { Pagination } from "../../components/ui/Pagination";
import ServiceDetailPage from "./services/[id]/page";
import { useRouter } from "next/navigation";


export interface Product {
  id: string;
  image: string;
  title: string;
  price: number | string;
  seller: string;
}

interface Service {
  id: number;
  image: string;
  title: string;
  description: string;
  fullDescription: string;
  category: string;
  deadline: string;
  startingBid: number;
  currentBid: number;
  totalBids: number;
  requiredSkills: string[];
  client: {
    name: string;
    username: string;
    avatar: string;
    bio: string;
    email: string;
    location: string;
  };
  budget: string | number; // ✅ Changed from string to string | number
  bids: string | number; // ✅ Changed from string to string | number
}

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState("products");
  const [category, setCategory] = useState("");
  const [size, setSize] = useState("");
  const [expertiseLevel, setExpertiseLevel] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showServiceDetail, setShowServiceDetail] = useState(false);
  const router = useRouter();
  // const fallbackProducts: Product[] = useMemo(
  //   () => [
  //     {
  //       id: "1",
  //       image: "/images/ankara-gown.jpg",
  //       title: "Ready-to-wear ankara gown",
  //       price: 19999,
  //       seller: "@sellers_username",
  //     },
  //     {
  //       id: "2",
  //       image: "/images/ankara-gown.jpg",
  //       title: "Leopard-skin blouse",
  //       price: 19999,
  //       seller: "@sellers_username",
  //     },
  //     {
  //       id: "3",
  //       image: "/images/ankara-gown.jpg",
  //       title: "Leopard-skin blouse",
  //       price: 19999,
  //       seller: "@sellers_username",
  //     },
  //     {
  //       id: "4",
  //       image: "/images/ankara-gown.jpg",
  //       title: "Leopard-skin blouse",
  //       price: 19999,
  //       seller: "@sellers_username",
  //     },
  //     {
  //       id: "5",
  //       image: "/images/ankara-gown.jpg",
  //       title: "Ready-to-wear ankara gown",
  //       price: 19999,
  //       seller: "@sellers_username",
  //     },
  //     {
  //       id: "6",
  //       image: "/images/ankara-gown.jpg",
  //       title: "Leopard-skin blouse",
  //       price: 19999,
  //       seller: "@sellers_username",
  //     },
  //     {
  //       id: "7",
  //       image: "/images/ankara-gown.jpg",
  //       title: "Leopard-skin blouse",
  //       price: 19999,
  //       seller: "@sellers_username",
  //     },
  //     {
  //       id: "8",
  //       image: "/images/ankara-gown.jpg",
  //       title: "Leopard-skin blouse",
  //       price: 19999,
  //       seller: "@sellers_username",
  //     },
  //   ],
  //   []
  // );

  const [fetchedProducts, setFetchedProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1)

  useEffect(() => {
    const fetchProducts = async () => {
      const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!backendUrl) {
        setProductsError("Missing NEXT_PUBLIC_API_BASE_URL for dev fetch.");
        return;
      }

      const limit =
        Number.parseInt(process.env.NEXT_PUBLIC_PRODUCTS_PER_PAGE || "", 10) ||
        12;

      try {
        setIsLoadingProducts(true);
        setProductsError(null);

        const params = {
          page: currentPage,
          limit,
          collection_id: null,
        } as const;

        const response = await fetch(
          `${backendUrl}/store/products?page=${params.page}&limit=${params.limit}&collection_id=${params.collection_id}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(`Request failed with ${response.status}`);
        }

        const data = await response.json();
        console.log(data)

        if (!Array.isArray(data.products)) {
          throw new Error("Unexpected response shape for products");
        }

        const mapped: Product[] = data.products.map((item: any) => ({
          id: String(item.id),
          image: item.thumbnail,
          title: item.title,
          price: item.price,
        }));

        setFetchedProducts(mapped);
        setTotalPages(Math.ceil(data.count / limit))
      } catch (error) {
        console.error("Failed to fetch products", error);
        setProductsError(
          error instanceof Error ? error.message : "Failed to fetch products"
        );
        setFetchedProducts([]);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [currentPage]);

  const services = [
    {
      id: 1,
      image: "/images/ankara-gown.jpg",
      title: "Custom wedding gown sewing",
      description:
        "Looking for a tailor to bring to life my wedding gown which has already be patterned out",
      fullDescription:
        "I'm looking for a skilled tailor to bring my design concept to life for an upcoming wedding. I have a clear vision, drafted patterns, and a collection of inspiration images for the wedding gown.",
      category: "Sewing and Tailoring",
      deadline: "2 weeks",
      startingBid: 100000,
      currentBid: 150000,
      totalBids: 5,
      requiredSkills: [
        "Fashion Design",
        "Pattern Drafting",
        "Alterations & Repairs",
      ],
      client: {
        name: "Amina Yusuf",
        username: "@aminat60",
        avatar: "/api/placeholder/80/80",
        bio: "Passionate about fashion and design.",
        email: "aminayusuf@gmail.com",
        location: "Lagos, NG",
      },
      budget: "150,000",
      bids: "5 - 10",
    },
    {
      id: 2,
      image: "/images/ankara-gown.jpg",
      title: "Custom wedding gown sewing",
      description:
        "Looking for a tailor to bring to life my wedding gown which has already be patterned out",
      fullDescription:
        "I'm looking for a skilled tailor to bring my design concept to life for an upcoming wedding. I have a clear vision, drafted patterns, and a collection of inspiration images for the wedding gown.",
      category: "Sewing and Tailoring",
      deadline: "3 weeks",
      startingBid: 120000,
      currentBid: 150000,
      totalBids: 8,
      requiredSkills: [
        "Fashion Design",
        "Pattern Drafting",
        "Alterations & Repairs",
      ],
      client: {
        name: "Folake Johnson",
        username: "@folake_j",
        avatar: "/api/placeholder/80/80",
        bio: "Fashion enthusiast and designer.",
        email: "folake@example.com",
        location: "Lagos, NG",
      },
      budget: "150,000",
      bids: "5 - 10",
    },
    {
      id: 3,
      image: "/images/ankara-gown.jpg",
      title: "Custom wedding gown sewing",
      description:
        "Looking for a tailor to bring to life my wedding gown which has already be patterned out",
      fullDescription:
        "I'm looking for a skilled tailor to bring my design concept to life for an upcoming wedding.",
      category: "Sewing and Tailoring",
      deadline: "4 weeks",
      startingBid: 100000,
      currentBid: 150000,
      totalBids: 6,
      requiredSkills: ["Fashion Design", "Pattern Drafting"],
      client: {
        name: "Zainab Ahmed",
        username: "@zainab_a",
        avatar: "/api/placeholder/80/80",
        bio: "Designer and creator.",
        email: "zainab@example.com",
        location: "Lagos, NG",
      },
      budget: "150,000",
      bids: "5 - 10",
    },
    {
      id: 4,
      image: "/images/ankara-gown.jpg",
      title: "Custom wedding gown sewing",
      description:
        "Looking for a tailor to bring to life my wedding gown which has already be patterned out",
      fullDescription: "Seeking experienced tailor for custom wedding gown.",
      category: "Sewing and Tailoring",
      deadline: "2 weeks",
      startingBid: 100000,
      currentBid: 150000,
      totalBids: 7,
      requiredSkills: ["Fashion Design", "Alterations & Repairs"],
      client: {
        name: "Ngozi Eze",
        username: "@ngozi_e",
        avatar: "/api/placeholder/80/80",
        bio: "Fashion lover.",
        email: "ngozi@example.com",
        location: "Lagos, NG",
      },
      budget: "150,000",
      bids: "5 - 10",
    },
    {
      id: 5,
      image: "/images/ankara-gown.jpg",
      title: "Custom wedding gown sewing",
      description:
        "Looking for a tailor to bring to life my wedding gown which has already be patterned out",
      fullDescription: "Need expert tailor for wedding gown project.",
      category: "Sewing and Tailoring",
      deadline: "3 weeks",
      startingBid: 100000,
      currentBid: 150000,
      totalBids: 4,
      requiredSkills: ["Fashion Design", "Pattern Drafting"],
      client: {
        name: "Aisha Bello",
        username: "@aisha_b",
        avatar: "/api/placeholder/80/80",
        bio: "Style enthusiast.",
        email: "aisha@example.com",
        location: "Lagos, NG",
      },
      budget: "150,000",
      bids: "5 - 10",
    },
    {
      id: 6,
      image: "/images/ankara-gown.jpg",
      title: "Custom wedding gown sewing",
      description:
        "Looking for a tailor to bring to life my wedding gown which has already be patterned out",
      fullDescription: "Looking for professional tailor for custom gown.",
      category: "Sewing and Tailoring",
      deadline: "2 weeks",
      startingBid: 100000,
      currentBid: 150000,
      totalBids: 9,
      requiredSkills: ["Fashion Design"],
      client: {
        name: "Chidinma Okon",
        username: "@chidi_o",
        avatar: "/api/placeholder/80/80",
        bio: "Creative designer.",
        email: "chidinma@example.com",
        location: "Lagos, NG",
      },
      budget: "150,000",
      bids: "5 - 10",
    },
    {
      id: 7,
      image: "/images/ankara-gown.jpg",
      title: "Custom wedding gown sewing",
      description:
        "Looking for a tailor to bring to life my wedding gown which has already be patterned out",
      fullDescription: "Experienced tailor needed for wedding gown.",
      category: "Sewing and Tailoring",
      deadline: "4 weeks",
      startingBid: 100000,
      currentBid: 150000,
      totalBids: 5,
      requiredSkills: ["Fashion Design", "Pattern Drafting"],
      client: {
        name: "Fatima Usman",
        username: "@fatima_u",
        avatar: "/api/placeholder/80/80",
        bio: "Fashion designer.",
        email: "fatima@example.com",
        location: "Lagos, NG",
      },
      budget: "150,000",
      bids: "5 - 10",
    },
    {
      id: 8,
      image: "/images/ankara-gown.jpg",
      title: "Custom wedding gown sewing",
      description:
        "Looking for a tailor to bring to life my wedding gown which has already be patterned out",
      fullDescription:
        "Skilled tailor required for custom wedding gown design.",
      category: "Sewing and Tailoring",
      deadline: "3 weeks",
      startingBid: 100000,
      currentBid: 150000,
      totalBids: 6,
      requiredSkills: ["Fashion Design", "Alterations & Repairs"],
      client: {
        name: "Blessing Nwosu",
        username: "@blessing_n",
        avatar: "/api/placeholder/80/80",
        bio: "Design enthusiast.",
        email: "blessing@example.com",
        location: "Lagos, NG",
      },
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

  let productsToShow = fetchedProducts;



  const handleProductClick = (product: Product) => {
    router.push(`/marketplace/products/${product.id}`);
  };

  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
    setShowServiceDetail(true);
  };

  const handleBackFromService = () => {
    setShowServiceDetail(false);
    setSelectedService(null);
  };

  if (showServiceDetail && selectedService) {
    return (
      <HomeLayout>
        <ServiceDetailPage
          service={selectedService}
          onBack={handleBackFromService}
        />
      </HomeLayout>
    );
  }

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
              className={`py-4 rounded-lg font-medium transition-all ${activeTab === "products"
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
          {productsError && (
            <div className="max-w-4xl mx-auto mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {productsError}
            </div>
          )}

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
              <ProductsGrid
                products={productsToShow}
                onProductClick={handleProductClick}
              />
            )
          ) : (
            <ServicesGrid
              services={services}
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
