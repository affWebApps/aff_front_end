"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Minus, Plus, ChevronLeft } from "lucide-react";
import Image from "next/image";
import { Button } from "../../../../components/ui/Button";

interface ProductDetailPageProps {
  product: {
    id: string | number;
    image: string;
    title: string;
    price: string | number;
    seller: string;
  };
  onBack?: () => void;
}

export default function ProductDetailPage({
  product,
  onBack,
}: ProductDetailPageProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("reviews");

  const productDetails = {
    oldPrice: "25,000",
    category: "Clothing",
    description:
      "Turn heads in this stunning Velvet Mermaid Gown. Crafted from luxurious, soft-touch stretch velvet, this dress is designed to hug your curves and create a breathtaking silhouette. Perfect for a grand dinner party.",
    colors: [
      { name: "Emerald green", value: "#064E3B" },
      { name: "Royal blue", value: "#1E40AF" },
      { name: "Kelly green", value: "#16A34A" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [product.image, product.image, product.image],
    keyFeatures: [
      "Style: Elegant Mermaid Trumpet Silhouette",
      "Neckline: Plunging Sweetheart Off-Shoulder",
      "Fabric: Premium stretch velvet with satin lining",
      "Details: Intricate beaded waist embellishments, with high-high split",
      "Occasion: Dinner Party, Formal Event, Black Tie, Wedding Guest Attire",
    ],
    rating: 4.9,
    reviewCount: 12,
    reviews: [
      {
        id: 1,
        author: "Chisom O.",
        rating: 4,
        comment:
          "Absolutely stunning dress! The attention to detail is impeccable.",
        date: "2 days ago",
      },
      {
        id: 2,
        author: "Ibrahim K.",
        rating: 5,
        comment: "Professional and creative. Did not exactly what I wanted.",
        date: "1 week ago",
      },
    ],
    sellerInfo: {
      name: "Amina Yusuf",
      username: product.seller,
      bio: "Passionate about fusing traditional African textiles with modern silhouettes. Specializing in custom designs that celebrate culture while embracing contemporary style.",
      email: "aminayusuf@gmail.com",
      location: "Lagos, NG",
    },
  };

  const relatedProducts = [
    {
      id: 2,
      title: "Leopard skin blouse",
      price: "19,999",
      seller: "@sellers_username",
      image: product.image,
    },
    {
      id: 3,
      title: "Leopard skin blouse",
      price: "19,999",
      seller: "@sellers_username",
      image: product.image,
    },
    {
      id: 4,
      title: "Leopard skin blouse",
      price: "19,999",
      seller: "@sellers_username",
      image: product.image,
    },
    {
      id: 5,
      title: "Leopard skin blouse",
      price: "19,999",
      seller: "@sellers_username",
      image: product.image,
    },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  const handleAddToCart = () => {
    window.dispatchEvent(
      new CustomEvent("showToast", {
        detail: {
          message: "Item added to cart successfully!",
          type: "success",
        },
      })
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <button
            onClick={handleBack}
            className="hover:text-gray-900 flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Marketplace
          </button>
          <span>/</span>
          <span>Products</span>
          <span>/</span>
          <span className="text-[#FAB75B]">{product.title}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg mb-4">
              <div className="aspect-4/5 bg-gray-100 flex items-center justify-center relative">
                <Image
                  src={productDetails.images[selectedImage]}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex gap-3">
              {productDetails.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all relative ${
                    selectedImage === idx
                      ? "border-[#FAB75B]"
                      : "border-gray-200"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.title} view ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {product.title}
            </h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-gray-300" />
              <span className="text-sm text-gray-600">by {product.seller}</span>
            </div>

            <p className="text-gray-700 mb-6">{productDetails.description}</p>

            <div className="mb-4">
              <span className="text-sm text-gray-600">Category: </span>
              <span className="text-sm font-medium text-gray-900">
                {productDetails.category}
              </span>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  ₦ {product.price}
                </span>
                <span className="text-lg text-gray-400 line-through">
                  ₦ {productDetails.oldPrice}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Color:{" "}
                <span className="text-gray-600 font-normal">
                  {productDetails.colors[selectedColor].name}
                </span>
              </label>
              <div className="flex gap-3">
                {productDetails.colors.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(idx)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === idx
                        ? "border-gray-900 scale-110"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color.value }}
                  />
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Size
              </label>
              <div className="flex gap-2">
                {productDetails.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedSize === size
                        ? "bg-gray-900 text-white"
                        : "bg-white border border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg bg-[#FAB75B] text-white flex items-center justify-center hover:bg-[#e9a548] transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="text-lg font-medium text-gray-900 w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg bg-[#FAB75B] text-white flex items-center justify-center hover:bg-[#e9a548] transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            <Button
              onClick={handleAddToCart}
              className="w-full "
              variant="default"
              size="large"
            >
              Add to Cart
            </Button>
          </motion.div>
        </div>

        <motion.div
          className="bg-white rounded-2xl p-8 mb-8 shadow-md"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Product Details
          </h2>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Key Features:</h3>
            <ul className="space-y-2">
              {productDetails.keyFeatures.map((feature, idx) => (
                <li key={idx} className="text-gray-700">
                  • {feature}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl shadow-md overflow-hidden mb-12"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab("reviews")}
                className={`flex-1 py-4 px-6 font-medium transition-colors ${
                  activeTab === "reviews"
                    ? "text-gray-900 border-b-2 border-[#FAB75B]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Customer&apos;s Reviews
              </button>
              <button
                onClick={() => setActiveTab("seller")}
                className={`flex-1 py-4 px-6 font-medium transition-colors ${
                  activeTab === "seller"
                    ? "text-gray-900 border-b-2 border-[#FAB75B]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Seller&apos;s Information
              </button>
            </div>
          </div>

          <div className="p-8">
            {activeTab === "reviews" ? (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-5xl font-bold text-gray-900">
                    {productDetails.rating}
                  </div>
                  <div>
                    <div className="flex gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(productDetails.rating)
                              ? "fill-[#FAB75B] text-[#FAB75B]"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-600">
                      Based on {productDetails.reviewCount} reviews
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {productDetails.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-gray-100 pb-6 last:border-0"
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">
                            {review.author}
                          </div>
                          <div className="flex gap-1 my-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "fill-[#FAB75B] text-[#FAB75B]"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-gray-700 mb-1">{review.comment}</p>
                          <div className="text-xs text-gray-500">
                            {review.date}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 rounded-full bg-gray-300 shrink-0"></div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {productDetails.sellerInfo.name}
                  </h3>
                  <div className="text-sm text-gray-600 mb-4">
                    {productDetails.sellerInfo.username}
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">BIO:</h4>
                    <p className="text-gray-700">
                      {productDetails.sellerInfo.bio}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      CONTACT INFORMATION
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-700">
                        <div className="w-5 h-5 text-gray-400">✉</div>
                        <span>{productDetails.sellerInfo.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <div className="w-5 h-5 text-gray-400">📍</div>
                        <span>{productDetails.sellerInfo.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            You might also like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <div
                key={relatedProduct.id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="aspect-square bg-gray-200 relative">
                  <Image
                    src={relatedProduct.image}
                    alt={relatedProduct.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {relatedProduct.title}
                  </h3>
                  <div className="text-lg font-bold text-gray-900 mb-2">
                    ₦ {relatedProduct.price}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-gray-300"></div>
                    <span className="text-sm text-gray-600">
                      {relatedProduct.seller}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
