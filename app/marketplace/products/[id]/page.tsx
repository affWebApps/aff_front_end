"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Star, Minus, Plus, ChevronLeft } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "../../../../components/ui/Button";
import HomeLayout from "../../../(home)/layout";
import { useAuthStore } from "@/store/authStore";


type Variant = {
  id: string;
  title: string;
  calculated_price?: {
    calculated_amount: number;
    currency_code: string;
  };
  options?: {
    id: string; // option value id
    value: string;
    option_id: string;
    option?: { id: string; title: string };
  }[];
  manage_inventory?: boolean;
  allow_backorder?: boolean;
  inventory_quantity?: number;
};

type ProductApi = {
  id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  images?: { url: string }[];
  variants?: Variant[];
  options?: {
    id: string;
    title: string;
    values?: { id: string; value: string }[];
  }[];
};

type Vendor = {
  vendorId: string;
  vendorHandle: string;
  vendorLogo: string;
}

interface ProductDetailPageProps {
  onBack?: () => void;
}

export default function ProductDetailPage({ onBack }: ProductDetailPageProps) {
  const routeParams = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null
  );
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("reviews");
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchedProduct, setFetchedProduct] = useState<ProductApi | null>(null);
  const [productVendor, setProductVendor] = useState<Vendor | null>(null);
  const { isAuthenticated, token } = useAuthStore();

  const effectiveProductId = routeParams?.id;

  const reviews = [
    {
      id: "rev_001",
      author: "Aisha Bello",
      comment: "Great quality fabric and fast delivery. I love it!",
      rating: 5,
      date: "2025-01-12",
    },
    {
      id: "rev_002",
      author: "John-Kingsley Egeonu",
      comment: "Nice design, but the sizing runs a bit small.",
      rating: 4,
      date: "2025-01-18",
    },
    {
      id: "rev_003",
      author: "Chinedu Okafor",
      comment: "Good value for money. Would buy again.",
      rating: 4,
      date: "2025-01-25",
    },
    {
      id: "rev_004",
      author: "Zainab Musa",
      comment: "The color looks even better in person.",
      rating: 5,
      date: "2025-02-02",
    },
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!backendUrl) {
        setError("Missing NEXT_PUBLIC_API_BASE_URL");
        return;
      }
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch(
          `${backendUrl}/store/products/${effectiveProductId}`,
          {
            headers: { "Content-Type": "application/json" },
            cache: "no-store",
          }
        );
        if (!res.ok) throw new Error(`Request failed with ${res.status}`);
        const data = await res.json();
        if (!data.product) throw new Error("Product not found");
        setFetchedProduct(data.product as ProductApi);
        console.log("fetchedProduct is", data.product);
        console.log("fetchedProduct vendor is", data.vendor);
        setProductVendor(data.vendor as Vendor);
        const firstVariant = data.product.variants?.[0];
        setSelectedVariantId(firstVariant?.id ?? null);
        if (firstVariant?.options?.length) {
          setSelectedOptions(
            Object.fromEntries(
              firstVariant.options.map((opt: any) => [opt.option_id, opt.id])
            )
          );
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [effectiveProductId]);

  const productDetails = useMemo(() => {
    const base = fetchedProduct;
    const images = base?.images?.map((i) => i.url).filter(Boolean) ?? [];

    const variants = base?.variants ?? [];
    const displayVariants =
      variants.length > 0 ? variants : [{ id: "one-size", title: "One Size" }];

    const matchByOptions =
      displayVariants.find((v) =>
        v.options?.every(
          (opt) => selectedOptions[opt.option_id] === opt.id
        )
      ) ?? null;

    const selectedVariant =
      matchByOptions ||
      displayVariants.find((v) => v.id === selectedVariantId) ||
      displayVariants[0];

    const optionGroups =
      base?.options?.map((opt) => ({
        id: opt.id,
        title: opt.title,
        values:
          opt.values?.map((v) => ({
            id: v.id,
            label: v.value,
          })) ?? [],
      })) ?? [];

    const price = selectedVariant?.calculated_price?.calculated_amount ?? null;

    return {

      title: base?.title ?? "Product",
      description: base?.description ?? "Product description not available.",
      images,
      variants: displayVariants,
      optionGroups,
      price,
      currency: selectedVariant?.calculated_price?.currency_code ?? "eur",
      seller: productVendor?.vendorHandle || "@store",
      category: "Clothing",
      oldPrice: null,
    };
  }, [fetchedProduct, selectedOptions, selectedVariantId]);

  // keep variant id in sync with option selections
  useEffect(() => {
    if (!fetchedProduct?.variants) return;
    const match =
      fetchedProduct.variants.find((v) =>
        v.options?.every(
          (opt) => selectedOptions[opt.option_id] === opt.id
        )
      ) ?? null;
    if (match && match.id !== selectedVariantId) {
      setSelectedVariantId(match.id);
    }
  }, [fetchedProduct?.variants, selectedOptions, selectedVariantId]);

  const selectedVariant =
    fetchedProduct?.variants?.find((v) => v.id === selectedVariantId) ?? null;

  const maxQuantity =
    selectedVariant?.inventory_quantity && selectedVariant.inventory_quantity > 0
      ? selectedVariant.inventory_quantity
      : Number.POSITIVE_INFINITY;

  const isOutOfStock = (() => {
    if (!selectedVariant) return true;
    if (selectedVariant.manage_inventory === false) return false;
    const qty = selectedVariant.inventory_quantity ?? 0;
    if (qty > 0) return false;
    return !selectedVariant.allow_backorder;
  })();

  const relatedProducts = [
    {
      id: 2,
      title: "Leopard skin blouse",
      price: "19,999",
      seller: "@sellers_username",
      image: '/images/ankara-gown.jpg',
    },
    {
      id: 3,
      title: "Leopard skin blouse",
      price: "19,999",
      seller: "@sellers_username",
      image: '/images/ankara-gown.jpg',
    },
    {
      id: 4,
      title: "Leopard skin blouse",
      price: "19,999",
      seller: "@sellers_username",
      image: '/images/ankara-gown.jpg',
    },
    {
      id: 5,
      title: "Leopard skin blouse",
      price: "19,999",
      seller: "@sellers_username",
      image: '/images/ankara-gown.jpg',
    },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    const redirect = searchParams?.get("redirect");
    if (redirect) {
      router.push(redirect);
      return;
    }

    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/marketplace");
  };

  const handleAddToCart = async () => {
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const redirectToSignIn = () => {
      const redirect =
        typeof window !== "undefined"
          ? `${window.location.pathname}${window.location.search}`
          : "/marketplace";
      router.push(`/sign-in?redirect=${encodeURIComponent(redirect)}`);
    };

    if (!isAuthenticated || !token) {
      redirectToSignIn();
      return;
    }

    if (!backendUrl) {
      window.dispatchEvent(
        new CustomEvent("showToast", {
          detail: { message: "Missing API base URL", type: "error" },
        })
      );
      return;
    }

    if (!selectedVariantId || !fetchedProduct?.id) {
      window.dispatchEvent(
        new CustomEvent("showToast", {
          detail: { message: "Please select a variant", type: "error" },
        })
      );
      return;
    }

    try {
      setIsAdding(true);
      const res = await fetch(`${backendUrl}/add_to_cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: fetchedProduct.id,
          variant_id: selectedVariantId,
          quantity,
        }),
      });

      if (!res.ok) {
        throw new Error(`Add to cart failed (${res.status})`);
      }

      window.dispatchEvent(
        new CustomEvent("showToast", {
          detail: {
            message: "Item added to cart successfully!",
            type: "success",
          },
        })
      );
    } catch (err) {
      window.dispatchEvent(
        new CustomEvent("showToast", {
          detail: {
            message:
              err instanceof Error
                ? err.message
                : "Could not add item to cart",
            type: "error",
          },
        })
      );
    } finally {
      setIsAdding(false);
    }
  };

  useEffect(() => {
    // reset selected image when new images arrive
    setSelectedImage(0);
  }, [productDetails.images.length]);

  useEffect(() => {
    if (!fetchedProduct?.options) return;
    setSelectedOptions((prev) => {
      const next = { ...prev };
      let changed = false;
      fetchedProduct?.options?.forEach((opt) => {
        if (!next[opt.id] && opt.values?.[0]) {
          next[opt.id] = opt.values[0].id;
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [fetchedProduct?.options]);

  if (isLoading) {
    return (
      <HomeLayout>
        <div className="min-h-screen bg-linear-to-b from-orange-50 to-white">
          <div className="container mx-auto px-4 py-10 space-y-8">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="aspect-4/5 bg-gray-200 rounded-2xl animate-pulse" />
                <div className="flex gap-3">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="w-20 h-20 rounded-lg bg-gray-200 animate-pulse"
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-16 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
                <div className="h-10 w-56 bg-gray-200 rounded animate-pulse" />
                <div className="h-12 w-full bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </HomeLayout>
    );
  }

  return (
    <HomeLayout>
      <div className="min-h-screen bg-linear-to-b from-orange-50 to-white">
        {error && (
          <div className="container mx-auto px-4 pt-6">
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          </div>
        )}
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <button
              onClick={handleBack}
              className="hover:text-gray-900 flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-[#FAB75B]">BACK</span>
            </button>
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
                  {isLoading ? (
                    <div className="text-gray-500 text-sm">Loading images...</div>
                  ) : productDetails.images.length > 0 ? (
                    <Image
                      src={productDetails.images[selectedImage]}
                      alt={productDetails.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="text-gray-500 text-sm">No image available</div>
                  )}
                </div>
              </div>
              {!isLoading && productDetails.images.length > 0 && (
                <div className="flex gap-3">
                  {productDetails.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all relative ${selectedImage === idx
                        ? "border-[#FAB75B]"
                        : "border-gray-200"
                        }`}
                    >
                      <Image
                        src={img}
                        alt={`${productDetails.title} view ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {productDetails.title}
              </h1>

              <div className="flex items-center gap-2 mb-4">
                <div className="" />
                {productVendor?.vendorLogo?.trim() && (
                  <Image src={productVendor?.vendorLogo} className="rounded-full" alt="Product" width={46}
                    height={46} />
                )}
                <span className="text-sm text-gray-600">
                  by {productDetails.seller}
                </span>
              </div>

              <p className="text-gray-700 mb-6">{productDetails.description}</p>

              <div className="mb-4">
                <span className="text-sm text-gray-600">Category: </span>
                <span className="text-sm font-medium text-gray-900">
                  Clothing
                </span>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-gray-900">
                    {productDetails.price !== null &&
                      productDetails.price !== undefined
                      ? `₦ ${productDetails.price}`
                      : "Price unavailable"}
                  </span>
                </div>
              </div>

              {productDetails.optionGroups.length > 0 ? (
                productDetails.optionGroups.map((group) => (
                  <div key={group.id} className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      {group.title}
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {group.values.map((val) => (
                        <button
                          key={val.id}
                          onClick={() =>
                            setSelectedOptions((prev) => ({
                              ...prev,
                              [group.id]: val.id,
                            }))
                          }
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedOptions[group.id] === val.id
                            ? "bg-gray-900 text-white"
                            : "bg-white border border-gray-300 text-gray-700 hover:border-gray-400"
                            }`}
                        >
                          {val.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Variants
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {productDetails.variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariantId(variant.id)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedVariantId === variant.id
                          ? "bg-gray-900 text-white"
                          : "bg-white border border-gray-300 text-gray-700 hover:border-gray-400"
                          }`}
                      >
                        {variant.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() =>
                      setQuantity((prev) => Math.max(1, Math.min(maxQuantity, prev - 1)))
                    }
                    className="w-10 h-10 rounded-lg bg-[#FAB75B] text-white flex items-center justify-center hover:bg-[#e9a548] transition-colors"
                    type="button"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    min={1}
                    max={Number.isFinite(maxQuantity) ? maxQuantity : undefined}
                    value={quantity}
                    onChange={(e) => {
                      const next = Number.parseInt(e.target.value, 10);
                      setQuantity((prev) => {
                        if (Number.isNaN(next)) return prev;
                        return Math.max(1, Math.min(maxQuantity, next));
                      });
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "." || e.key === "e" || e.key === "E") {
                        e.preventDefault();
                      }
                    }}
                    className="text-center text-lg font-medium text-gray-900 border border-gray-300 rounded-lg py-2  focus:outline-none focus:ring-2 focus:ring-[#FAB75B] transition-all appearance-none"
                    style={{
                      MozAppearance: "textfield",
                      width: `${Math.max(String(quantity).length + 1, 5)}ch`,
                      minWidth: "5ch",
                    }}
                  />
                  <button
                    onClick={() =>
                      setQuantity((prev) =>
                        Math.max(1, Math.min(maxQuantity, prev + 1))
                      )
                    }
                    className="w-10 h-10 rounded-lg bg-[#FAB75B] text-white flex items-center justify-center hover:bg-[#e9a548] transition-colors"
                    type="button"
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
                disabled={isOutOfStock || isAdding}
              >
                {isOutOfStock ? "Out of Stock" : isAdding ? "Adding..." : "Add to Cart"}
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
            {/* <div>
            <h3 className="font-semibold text-gray-900 mb-3">Key Features:</h3>
            <ul className="space-y-2">
              {productDetails.keyFeatures.map((feature, idx) => (
                <li key={idx} className="text-gray-700">
                  • {feature}
                </li>
              ))}
            </ul>
          </div> */}
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
                  className={`flex-1 py-4 px-6 font-medium transition-colors ${activeTab === "reviews"
                    ? "text-gray-900 border-b-2 border-[#FAB75B]"
                    : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  Customer&apos;s Reviews
                </button>
                <button
                  onClick={() => setActiveTab("seller")}
                  className={`flex-1 py-4 px-6 font-medium transition-colors ${activeTab === "seller"
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
                  <div className="flex justify-center gap-4 mb-6">
                    <div className="text-5xl font-bold text-gray-900">
                      {5}
                    </div>
                    <div>
                      <div className="flex gap-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${i < Math.floor(5)
                              ? "fill-[#FAB75B] text-[#FAB75B]"
                              : "text-gray-300"
                              }`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-gray-600">
                        Based on {25} reviews
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {reviews.map((review: any) => (
                      <div
                        key={review.id}
                        className="border-b border-gray-100 pb-6 last:border-0"
                      >
                        <div className="flex items-start gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-blue-300">
                            <img src="/images/ankara-gown.jpg" className="rounded-full" alt="" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">
                              {review.author}
                            </div>
                            <div className="flex gap-1 my-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < review.rating
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
                  <div className="w-20 h-20 rounded-full bg-gray-300 shrink-0">
                    <img src="/images/ankara-gown.jpg" className="rounded-full" alt="" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {`productDetails.sellerInfo.name`}
                    </h3>
                    <div className="text-sm text-gray-600 mb-4">
                      {`productDetails.sellerInfo.username`}
                    </div>

                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-2">BIO:</h4>
                      <p className="text-gray-700">
                        {`productDetails.sellerInfo.bio`}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">
                        CONTACT INFORMATION
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-700">
                          <div className="w-5 h-5 text-gray-400">✉</div>
                          <span>{`productDetails.sellerInfo.email`}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <div className="w-5 h-5 text-gray-400">📍</div>
                          <span>{`productDetails.sellerInfo.location`}</span>
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
                      src={relatedProduct.image as any || null}
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
    </HomeLayout>
  );
}
