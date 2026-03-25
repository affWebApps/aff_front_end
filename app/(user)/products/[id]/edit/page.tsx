"use client";

import { DragEvent, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Image as ImageIcon, X } from "lucide-react";
import { uploadFileToSupabase } from "@/lib/storageService";
import {
  useUpdateVendorProduct,
  useVendorProduct,
  VendorProductImage,
} from "@/hooks/useProducts";

type ExistingImage = {
  key: string;
  id?: string;
  url: string;
  removed?: boolean;
};

type NewImage = {
  key: string;
  file: File;
  previewUrl: string;
  uploadedUrl?: string;
};

type PreviewImage = {
  key: string;
  url: string;
  isExisting: boolean;
};

type VariantPriceDraft = Record<
  string,
  {
    amount: string;
    currency_code: string;
    priceId?: string;
  }
>;

const slugify = (str: string) =>
  str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const moveItem = <T,>(items: T[], from: number, to: number) => {
  if (to < 0 || to >= items.length) return items;
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

const makeNewImageKey = (file: File) =>
  `new:${file.name}-${file.size}-${file.lastModified}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const productId = params?.id;
  const { data: product, isLoading, error } = useVendorProduct(productId);
  const updateProduct = useUpdateVendorProduct();

  const [title, setTitle] = useState("");
  const [handle, setHandle] = useState("");
  const [description, setDescription] = useState("");
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [newImages, setNewImages] = useState<NewImage[]>([]);
  const [imageOrder, setImageOrder] = useState<string[]>([]);
  const [variantPrices, setVariantPrices] = useState<VariantPriceDraft>({});
  const [isUploading, setIsUploading] = useState(false);
  const [draggedImageKey, setDraggedImageKey] = useState<string | null>(null);

  useEffect(() => {
    if (!product) return;

    setTitle(product.title || "");
    setHandle(product.handle || slugify(product.title || ""));
    setDescription(product.description || "");
    const hydratedImages = (product.images || []).map(
      (image: VendorProductImage) => ({
        key: image.id ? `existing:${image.id}` : `existing:${image.url}`,
        id: image.id,
        url: image.url,
        removed: false,
      })
    );
    setExistingImages(hydratedImages);
    setImageOrder(hydratedImages.map((image) => image.key));
    setVariantPrices(
      Object.fromEntries(
        (product.variants || []).map((variant) => {
          const firstPrice = variant.prices?.[0];
          return [
            variant.id,
            {
              amount: String(
                firstPrice?.amount ??
                  variant.calculated_price?.calculated_amount ??
                  ""
              ),
              currency_code:
                firstPrice?.currency_code ??
                variant.calculated_price?.currency_code ??
                "ngn",
              priceId: firstPrice?.id,
            },
          ];
        })
      )
    );
  }, [product]);

  useEffect(() => {
    return () => {
      newImages.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    };
  }, [newImages]);

  const activeExistingImages = useMemo(
    () => existingImages.filter((image) => !image.removed),
    [existingImages]
  );

  const allPreviewImages = useMemo(
    () => {
      const imageEntries: Array<[string, PreviewImage]> = [
        ...activeExistingImages.map(
          (image): [string, PreviewImage] => [
            image.key,
            {
              key: image.key,
              url: image.url,
              isExisting: true,
            },
          ]
        ),
        ...newImages.map(
          (image): [string, PreviewImage] => [
            image.key,
            {
              key: image.key,
              url: image.previewUrl,
              isExisting: false,
            },
          ]
        ),
      ];

      const imageMap = new Map<string, PreviewImage>(imageEntries);

      const ordered = imageOrder
        .map((key) => imageMap.get(key))
        .filter((image): image is PreviewImage => Boolean(image));

      const missing = Array.from(imageMap.entries())
        .filter(([key]) => !imageOrder.includes(key))
        .map(([, image]) => image);

      return [...ordered, ...missing];
    },
    [activeExistingImages, newImages, imageOrder]
  );

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (!files.length) return;

    const mapped = files.map((file) => ({
      key: makeNewImageKey(file),
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setNewImages((prev) => [...prev, ...mapped]);
    setImageOrder((prev) => [...prev, ...mapped.map((image) => image.key)]);
    e.target.value = "";
  };

  const handleImageDragStart = (key: string) => {
    setDraggedImageKey(key);
  };

  const handleImageDrop = (targetKey: string) => {
    if (!draggedImageKey || draggedImageKey === targetKey) return;
    setImageOrder((prev) => {
      const from = prev.indexOf(draggedImageKey);
      const to = prev.indexOf(targetKey);
      if (from === -1 || to === -1) return prev;
      return moveItem(prev, from, to);
    });
    setDraggedImageKey(null);
  };

  const handleImageDragEnd = () => {
    setDraggedImageKey(null);
  };

  const handleRemoveExistingImage = (targetKey: string) => {
    setExistingImages((prev) =>
      prev.map((image) =>
        image.key === targetKey ? { ...image, removed: true } : image
      )
    );
    setImageOrder((prev) => prev.filter((key) => key !== targetKey));
  };

  const handleRemoveNewImage = (targetKey: string) => {
    setNewImages((prev) => {
      const found = prev.find((img) => img.key === targetKey);
      if (found) URL.revokeObjectURL(found.previewUrl);
      return prev.filter((img) => img.key !== targetKey);
    });
    setImageOrder((prev) => prev.filter((key) => key !== targetKey));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) return;

    if (!title.trim()) {
      alert("Product title is required.");
      return;
    }

    const invalidVariant = (product?.variants || []).find((variant) => {
      const draft = variantPrices[variant.id];
      return !draft?.amount || Number(draft.amount) <= 0;
    });

    if (invalidVariant) {
      alert(`Please set a valid price for ${invalidVariant.title}.`);
      return;
    }

    let uploadedNewImages: Array<{ url: string }> = [];

    try {
      setIsUploading(true);

      uploadedNewImages = await Promise.all(
        newImages.map(async (image) => {
          if (image.uploadedUrl) return { url: image.uploadedUrl };
          const res = await uploadFileToSupabase({
            file: image.file,
            folder: "public/products",
          });
          if (!res.publicUrl) {
            throw new Error("Image upload failed");
          }
          return { url: res.publicUrl };
        })
      );

      const uploadedMap = new Map(
        newImages.map((image, index) => [image.key, uploadedNewImages[index]])
      );
      const existingMap = new Map(
        activeExistingImages.map((image) => [image.key, image])
      );

      const mergedImages = allPreviewImages
        .map((image) => {
          if (image.isExisting) {
            const existingImage = existingMap.get(image.key);
            if (!existingImage) return null;
            return {
              ...(existingImage.id ? { id: existingImage.id } : {}),
              url: existingImage.url,
            };
          }

          return uploadedMap.get(image.key) || null;
        })
        .filter(Boolean) as Array<{ id?: string; url: string }>;

      if (!mergedImages.length) {
        alert("Please keep or add at least one image.");
        return;
      }

      const payload = {
        title: title.trim(),
        handle: handle.trim() || slugify(title),
        description: description.trim(),
        thumbnail: mergedImages[0].url,
        images: mergedImages,
        variants: (product?.variants || []).map((variant) => {
          const draft = variantPrices[variant.id];
          return {
            id: variant.id,
            prices: [
              {
                ...(draft?.priceId ? { id: draft.priceId } : {}),
                currency_code: draft?.currency_code || "ngn",
                amount: Number(draft?.amount || 0),
              },
            ],
          };
        }),
      };

      await updateProduct.mutateAsync({ productId, payload });
      router.push("/products");
    } catch (err) {
      console.error("Update product failed:", err);
      alert("Failed to update product. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm p-8">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-8" />
          <div className="space-y-4">
            <div className="h-12 bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-48 bg-gray-100 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8 space-y-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            Unable to load product
          </h1>
          <p className="text-gray-600">
            {error instanceof Error
              ? error.message
              : "The product could not be loaded."}
          </p>
          <button
            onClick={() => router.push("/products")}
            className="px-5 py-3 rounded-lg bg-[#FAB75B] text-white font-semibold hover:bg-[#e9a548] transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm p-6 lg:p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex items-center gap-3 text-[#4B2F23]">
            <button
              type="button"
              onClick={() => router.push("/products")}
              className="text-sm hover:underline"
            >
              ←
            </button>
            <h1 className="text-2xl font-semibold">Edit Product</h1>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <section className="space-y-3">
                <h2 className="font-semibold text-gray-900">Product Details</h2>
                <div className="space-y-2">
                  <label className="text-sm text-gray-700">Product title</label>
                  <input
                    value={title}
                    onChange={(e) => {
                      const nextTitle = e.target.value;
                      setTitle(nextTitle);
                      if (!handle.trim() || handle === slugify(title)) {
                        setHandle(slugify(nextTitle));
                      }
                    }}
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-700">Handle</label>
                  <input
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-700">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full min-h-[180px] rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <section className="space-y-3">
                <h2 className="font-semibold text-gray-900">Images</h2>
                <p className="text-xs text-gray-500">
                  Drag images to reorder. The first image will be used as the thumbnail.
                </p>
                <label className="border border-dashed border-gray-300 rounded-xl w-full h-48 flex flex-col items-center justify-center text-center cursor-pointer hover:border-amber-300 transition">
                  <ImageIcon className="w-6 h-6 text-gray-500 mb-2" />
                  <span className="text-sm text-gray-700">
                    Upload more images
                  </span>
                  <span className="text-xs text-gray-500">
                    Existing images remain unless you remove them
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleAddImages}
                  />
                </label>

                {allPreviewImages.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-[11px] text-gray-500">
                      Reorder the images to control which one appears first.
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {allPreviewImages.map((image, index) => (
                      <div
                        key={image.key}
                        draggable
                        onDragStart={() => handleImageDragStart(image.key)}
                        onDragOver={(e: DragEvent<HTMLDivElement>) => e.preventDefault()}
                        onDrop={() => handleImageDrop(image.key)}
                        onDragEnd={handleImageDragEnd}
                        className={`border rounded-lg p-2 space-y-2 bg-white ${
                          draggedImageKey === image.key
                            ? "border-amber-400 opacity-60"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={image.url}
                            alt={`Product image ${index + 1}`}
                            className="w-full h-28 object-cover rounded-md"
                          />
                          <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-[#4B2F23] text-white text-[11px] font-semibold flex items-center justify-center shadow-sm">
                            {index + 1}
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              image.isExisting
                                ? handleRemoveExistingImage(image.key)
                                : handleRemoveNewImage(image.key)
                            }
                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 text-red-500 hover:text-red-700 flex items-center justify-center shadow-sm"
                            aria-label="Remove image"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                    </div>
                  </div>
                )}
              </section>
            </div>
          </div>

          <section className="space-y-4">
            <h2 className="font-semibold text-gray-900">Variant Pricing</h2>
            <div className="grid gap-3">
              {(product.variants || []).map((variant) => (
                <div
                  key={variant.id}
                  className="border border-gray-200 rounded-lg p-4 grid md:grid-cols-[1fr_180px] gap-4 items-center"
                >
                  <div>
                    <div className="font-semibold text-gray-900">{variant.title}</div>
                    <div className="text-sm text-gray-500">{variant.id}</div>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={variantPrices[variant.id]?.amount || ""}
                    onChange={(e) =>
                      setVariantPrices((prev) => ({
                        ...prev,
                        [variant.id]: {
                          ...prev[variant.id],
                          amount: e.target.value,
                          currency_code:
                            prev[variant.id]?.currency_code || "ngn",
                        },
                      }))
                    }
                    placeholder="Price"
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                </div>
              ))}
            </div>
          </section>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => router.push("/products")}
              className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || updateProduct.isPending}
              className="w-full sm:w-auto px-6 py-3 bg-[#FAB75B] text-white font-semibold rounded-lg hover:bg-[#e9a548] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isUploading || updateProduct.isPending
                ? "Saving changes..."
                : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
