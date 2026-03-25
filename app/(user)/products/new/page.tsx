"use client";

import { DragEvent, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useMemo, useState } from "react";
import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Image as ImageIcon } from "lucide-react";
import { uploadFileToSupabase } from "@/lib/storageService";
import { CreateVendorProductPayload, useCreateVendorProduct } from "@/hooks/useProducts";

const defaultColourOptions = ["Blue", "Black", "Green", "Red", "Grey"];
const defaultSizeOptions = ["S", "M", "L", "XL"];
type FormState = {
  name: string;
  description: string;
  price: string;
  quantity: string;
  category: string;
};
type CustomAttribute = { name: string; values: string[] };
type VariantOverride = { price?: string; quantity?: string };
type VariantCombo = { key: string; label: string; pairs: { name: string; value: string }[] };
type UploadCache = Record<string, string>; // fileKey -> publicUrl

const moveItem = <T,>(items: T[], from: number, to: number) => {
  if (to < 0 || to >= items.length || from === to) return items;
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

export default function NewProductPage() {
  const router = useRouter();
  const createVendorProduct = useCreateVendorProduct();
  const draftKey = "draft:new-product";
  const defaultShippingProfileId =
    process.env.NEXT_PUBLIC_DEFAULT_SHIPPING_PROFILE_ID ??
    process.env.DEFAULT_SHIPPING_PROFILE_ID ??
    "";

  const loadDraft = (): {
    form?: FormState;
    selectedColours?: string[];
    selectedSizes?: string[];
    colourOptions?: string[];
    sizeOptions?: string[];
    customAttributes?: CustomAttribute[];
    customAttrValues?: string[];
    customAttrName?: string;
    customAttrValue?: string;
    newColour?: string;
    newSize?: string;
    removedVariants?: string[];
    variantOverrides?: Record<string, VariantOverride>;
    variantCombos?: { key: string; label: string }[];
    uploadCache?: UploadCache;
  } | null => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem(draftKey);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  const draft = loadDraft();

  const [form, setForm] = useState<FormState>({
    name: draft?.form?.name ?? "",
    description: draft?.form?.description ?? "",
    price: "", // deprecated when using per-variant
    quantity: "", // deprecated when using per-variant
    category: draft?.form?.category ?? "",
  });
  const [selectedColours, setSelectedColours] = useState<string[]>(
    draft?.selectedColours ?? []
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    draft?.selectedSizes ?? []
  );
  const [files, setFiles] = useState<File[]>([]);
  const [colourOptions, setColourOptions] = useState<string[]>(
    draft?.colourOptions ?? defaultColourOptions
  );
  const [sizeOptions, setSizeOptions] = useState<string[]>(
    draft?.sizeOptions ?? defaultSizeOptions
  );
  const [newColour, setNewColour] = useState(draft?.newColour ?? "");
  const [newSize, setNewSize] = useState(draft?.newSize ?? "");
  const [customAttrName, setCustomAttrName] = useState(draft?.customAttrName ?? "");
  const [customAttrValue, setCustomAttrValue] = useState(draft?.customAttrValue ?? "");
  const [customAttrValues, setCustomAttrValues] = useState<string[]>(
    draft?.customAttrValues ?? []
  );
  const [customAttributes, setCustomAttributes] = useState<CustomAttribute[]>(
    draft?.customAttributes ?? []
  );
  const [filePreviews, setFilePreviews] = useState<{ url: string; name: string; type: string }[]>(
    []
  );
  const [removedVariants, setRemovedVariants] = useState<string[]>(
    draft?.removedVariants ?? []
  );
  const [variantOverrides, setVariantOverrides] = useState<Record<string, VariantOverride>>(
    draft?.variantOverrides ?? {}
  );
  const [uploadCache, setUploadCache] = useState<UploadCache>(draft?.uploadCache ?? {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draggedFileIndex, setDraggedFileIndex] = useState<number | null>(null);

  const variantCombosRaw: VariantCombo[] = useMemo(() => {
    // Build attribute sets from selected colour/size and saved custom options
    const attrs: { name: string; values: string[] }[] = [];
    if (selectedColours.length) attrs.push({ name: "Color", values: selectedColours });
    if (selectedSizes.length) attrs.push({ name: "Size", values: selectedSizes });
    customAttributes.forEach((attr) => {
      if (attr.values.length) attrs.push(attr);
    });

    if (!attrs.length) return [];

    const cartesian = (sets: { name: string; values: string[] }[]): VariantCombo[] => {
      let acc: { pairs: { name: string; value: string }[] }[] = [{ pairs: [] }];
      sets.forEach((set) => {
        acc = acc.flatMap((item) =>
          set.values.map((v) => ({
            pairs: [...item.pairs, { name: set.name, value: v }],
          }))
        );
      });
      return acc.map((item) => {
        const key = item.pairs.map((p) => `${p.name}:${p.value}`).join("|");
        const label = item.pairs.map((p) => `${p.name}: ${p.value}`).join(" • ");
        return { key, label, pairs: item.pairs };
      });
    };

    const combos = cartesian(attrs);
    return combos;
  }, [selectedColours, selectedSizes, customAttributes]);

  // Sync removed variants and overrides when combos change
  useEffect(() => {
    const keys = new Set(variantCombosRaw.map((c) => c.key));
    const filteredRemoved = removedVariants.filter((r) => keys.has(r));
    if (filteredRemoved.length !== removedVariants.length) {
      setRemovedVariants(filteredRemoved);
    }
    setVariantOverrides((prev) => {
      const next: Record<string, VariantOverride> = {};
      variantCombosRaw.forEach((c) => {
        if (prev[c.key]) next[c.key] = prev[c.key];
      });
      return next;
    });
  }, [variantCombosRaw, removedVariants]);

  const variantCombos = useMemo(
    () => variantCombosRaw.filter((c) => !removedVariants.includes(c.key)),
    [variantCombosRaw, removedVariants]
  );

  // Persist draft (debounced via timeout)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const timeout = setTimeout(() => {
      const payload = {
        form,
        selectedColours,
        selectedSizes,
        colourOptions,
        sizeOptions,
        customAttributes,
        customAttrValues,
        customAttrName,
        customAttrValue,
        newColour,
        newSize,
        removedVariants,
        variantCombos,
        variantOverrides,
        uploadCache,
      };
      localStorage.setItem(draftKey, JSON.stringify(payload));
    }, 400);
    return () => clearTimeout(timeout);
  }, [form, selectedColours, selectedSizes, colourOptions, sizeOptions, customAttributes]);

  const clearDraft = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(draftKey);
  };

  const toggleColour = (c: string) =>
    setSelectedColours((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );

  const toggleSize = (s: string) =>
    setSelectedSizes((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const incoming = e.target.files ? Array.from(e.target.files) : [];
    if (!incoming.length) return;
    setFiles((prev) => [...prev, ...incoming]);
  };

  const handleImageDragStart = (index: number) => {
    setDraggedFileIndex(index);
  };

  const handleImageDrop = (targetIndex: number) => {
    if (draggedFileIndex === null) return;
    setFiles((prev) => moveItem(prev, draggedFileIndex, targetIndex));
    setDraggedFileIndex(null);
  };

  const handleImageDragEnd = () => {
    setDraggedFileIndex(null);
  };

  // Generate object URLs for previews
  useEffect(() => {
    if (!files.length) {
      setFilePreviews([]);
      return;
    }
    const previews = files.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      type: file.type,
    }));
    setFilePreviews(previews);
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [files]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!form.name.trim()) {
      alert("Product name is required");
      return;
    }
    if (!variantCombos.length) {
      alert("Please select options to create at least one variant.");
      return;
    }
    const missingVariant = variantCombos.find(
      (v: VariantCombo) =>
        !variantOverrides[v.key]?.price ||
        !variantOverrides[v.key]?.quantity ||
        Number(variantOverrides[v.key]?.price) <= 0
    );
    if (missingVariant) {
      alert(`Please set price and stock for variant: ${missingVariant.label}`);
      return;
    }
    if (!files.length) {
      alert("Please add at least one product image.");
      return;
    }
    if (!defaultShippingProfileId) {
      alert("Default shipping profile is not configured.");
      return;
    }

    let imageUrls: string[] = [];
    try {
      const uploads = await Promise.all(
        files.map(async (file) => {
          const key = `${file.name}-${file.size}-${file.lastModified}`;
          if (uploadCache[key]) {
            return { publicUrl: uploadCache[key] };
          }
          const res = await uploadFileToSupabase({ file, folder: "public/products" });
          if (res.publicUrl) {
            setUploadCache((prev) => ({ ...prev, [key]: res.publicUrl! }));
          }
          return res;
        })
      );
      imageUrls = uploads
        .map((u) => u.publicUrl)
        .filter((u): u is string => Boolean(u));
      if (!imageUrls.length) {
        alert("Image upload failed.");
        return;
      }
    } catch (err) {
      console.error("Upload error", err);
      alert("Image upload failed. Please try again.");
      return;
    }
    const thumbnail = imageUrls[0];

    // Build options array
    const optionsArray: { title: string; values: string[] }[] = [];
    if (selectedColours.length) optionsArray.push({ title: "Color", values: selectedColours });
    if (selectedSizes.length) optionsArray.push({ title: "Size", values: selectedSizes });
    customAttributes.forEach((attr) => {
      if (attr.values.length) {
        optionsArray.push({ title: attr.name, values: attr.values });
      }
    });

    // Build variants with price/stock
    const variantsPayload = variantCombos.map((v) => {
      const override = variantOverrides[v.key] || {};
      const opts: Record<string, string> = {};
      v.pairs.forEach((p: { name: string; value: string }) => {
        opts[p.name] = p.value;
      });
      return {
        title: v.pairs.map((p: { name: string; value: string }) => p.value).join(", "),
        manage_inventory: true,
        allow_backorder: false,
        options: opts,
        prices: [
          {
            amount: Number(override.price),
            currency_code: "ngn",
          },
        ],
        // stock quantity
        stock_quantity: Number(override.quantity),
      };
    });

    const slugify = (str: string) =>
      str
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");

    const payload: CreateVendorProductPayload = {
      variants: variantsPayload,
      title: form.name,
      status: "published",
      description: form.description,
      handle: slugify(form.name),
      shipping_profile_id: defaultShippingProfileId,
      thumbnail,
      images: imageUrls.map((url) => ({ url })),
      options: optionsArray,
    };

    setIsSubmitting(true);
    try {
      const res = await createVendorProduct.mutateAsync(payload);
      console.log("Prepared payload for /store/vendors/products:", payload);
      console.log("Create product response", res);
      clearDraft();
      router.push("/products/new/success");
    } catch (err: any) {
      console.error("Create product error", err?.response?.data || err);
      alert("Failed to create product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const preventEnterSubmit = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8">
      <form
        onSubmit={handleSubmit}
        onKeyDown={preventEnterSubmit}
        className="space-y-8"
      >
        <div className="flex items-center gap-3 text-[#4B2F23]">
          <button
            type="button"
            onClick={() => router.push("/products")}
            className="text-sm hover:underline"
          >
            ←
          </button>
          <h1 className="text-2xl font-semibold">List New Product</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left column */}
          <div className="space-y-6">
            <section className="space-y-3">
              <h2 className="font-semibold text-gray-900">Product Details</h2>
              <div className="space-y-2">
                <label className="text-sm text-gray-700">Product name</label>
                <input
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                  placeholder="Enter product name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-700">Description</label>
                <textarea
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm min-h-[120px] focus:outline-none focus:ring-2 focus:ring-amber-300"
                  placeholder="Describe your product"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="font-semibold text-gray-900">Pricing and Inventory</h2>
              <p className="text-sm text-gray-600">
                Pricing is now per variant. Set price and stock in the Variants section below.
              </p>
            </section>

            <section className="space-y-3">
              <span>
                <h2 className="font-semibold text-gray-900">Attributes</h2>
                <p className="text-xs mb-3">Please check the ones that apply or add custom</p>
              </span>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">Colour Options</label>
                <div className="flex flex-wrap gap-2 items-center">
                  {colourOptions.map((c: string) => {
                    const active = selectedColours.includes(c);
                    return (
                      <button
                        type="button"
                        key={c}
                        onClick={() => toggleColour(c)}
                        className={`px-3 py-1 rounded-md text-sm border ${active
                          ? "border-amber-400 bg-amber-50 text-amber-700"
                          : "border-gray-200 bg-white text-gray-800"
                          }`}
                      >
                        {c}
                      </button>
                    );
                  })}
                  <div className="flex items-center gap-1">
                    <input
                      value={newColour}
                      onChange={(e) => setNewColour(e.target.value)}
                      placeholder="Add colour"
                      className="w-28 rounded-md border border-gray-200 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const val = newColour.trim();
                        if (val && !colourOptions.includes(val)) {
                          setColourOptions((prev) => [...prev, val]);
                          setSelectedColours((prev) => [...prev, val]);
                          setNewColour("");
                        }
                      }}
                      className="p-2 rounded-md border border-gray-200 text-gray-700 hover:bg-amber-50"
                      aria-label="Add colour"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">Size Options</label>
                <div className="flex flex-wrap gap-2 items-center">
                  {sizeOptions.map((s: string) => {
                    const active = selectedSizes.includes(s);
                    return (
                      <button
                        type="button"
                        key={s}
                        onClick={() => toggleSize(s)}
                        className={`px-3 py-1 rounded-md text-sm border ${active
                          ? "border-amber-400 bg-amber-50 text-amber-700"
                          : "border-gray-200 bg-white text-gray-800"
                          }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                  <div className="flex items-center gap-1">
                    <input
                      value={newSize}
                      onChange={(e) => setNewSize(e.target.value)}
                      placeholder="Add size"
                      className="w-24 rounded-md border border-gray-200 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const val = newSize.trim();
                        if (val && !sizeOptions.includes(val)) {
                          setSizeOptions((prev) => [...prev, val]);
                          setSelectedSizes((prev) => [...prev, val]);
                          setNewSize("");
                        }
                      }}
                      className="p-2 rounded-md border border-gray-200 text-gray-700 hover:bg-amber-50"
                      aria-label="Add size"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">

                {customAttributes.length > 0 && (
                  <div className="space-y-2">
                    {customAttributes.map((attr, idx) => (
                      <div key={`${attr.name}-${idx}`} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-semibold text-gray-800">{attr.name}</div>
                          <button
                            type="button"
                            onClick={() =>
                              setCustomAttributes((prev) => prev.filter((_, i) => i !== idx))
                            }
                            className="text-gray-500 hover:text-red-500"
                            aria-label={`Remove ${attr.name}`}
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {attr.values.map((v) => (
                            <span
                              key={v}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-sm border border-amber-300 bg-amber-50 text-amber-800"
                            >
                              {v}
                              <button
                                type="button"
                                onClick={() =>
                                  setCustomAttributes((prev) =>
                                    prev.map((a, i) =>
                                      i === idx
                                        ? { ...a, values: a.values.filter((val) => val !== v) }
                                        : a
                                    )
                                  )
                                }
                                className="text-amber-700 hover:text-amber-900"
                                aria-label={`Remove ${v}`}
                              >
                                <X size={12} />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <label className="text-sm font-semibold text-gray-800">Custom Option</label>

                <div className="flex flex-col sm:flex-row gap-2">

                  <input
                    value={customAttrName}
                    onChange={(e) => setCustomAttrName(e.target.value)}
                    placeholder="Option name (e.g. Material)"
                    className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                  <div className="flex gap-1">
                    <input
                      value={customAttrValue}
                      onChange={(e) => setCustomAttrValue(e.target.value)}
                      placeholder="Add value"
                      className="w-36 rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const val = customAttrValue.trim();
                        // Prevent duplicates within pending and within existing option of same name
                        const existingValuesForName =
                          customAttrName.trim().length > 0
                            ? customAttributes.find(
                              (a) =>
                                a.name.toLowerCase() ===
                                customAttrName.trim().toLowerCase()
                            )?.values || []
                            : [];
                        if (
                          val &&
                          !customAttrValues.includes(val) &&
                          !existingValuesForName.includes(val)
                        ) {
                          setCustomAttrValues((prev) => [...prev, val]);
                          setCustomAttrValue("");
                        }
                      }}
                      className="p-2 rounded-md border border-gray-200 text-gray-700 hover:bg-amber-50"
                      aria-label="Add custom value"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                {customAttrValues.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {customAttrValues.map((val) => (
                      <span
                        key={val}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-sm border border-amber-300 bg-amber-50 text-amber-800"
                      >
                        {val}
                        <button
                          type="button"
                          onClick={() =>
                            setCustomAttrValues((prev) => prev.filter((v) => v !== val))
                          }
                          className="text-amber-700 hover:text-amber-900"
                          aria-label={`Remove ${val}`}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex">
                  <button
                    type="button"
                    onClick={() => {
                      const name = customAttrName.trim();
                      if (!name || customAttrValues.length === 0) return;
                      setCustomAttributes((prev) => {
                        const idx = prev.findIndex(
                          (a) => a.name.toLowerCase() === name.toLowerCase()
                        );
                        if (idx >= 0) {
                          const merged = Array.from(
                            new Set([...prev[idx].values, ...customAttrValues])
                          );
                          const next = [...prev];
                          next[idx] = { ...prev[idx], values: merged, name: prev[idx].name };
                          return next;
                        }
                        return [...prev, { name, values: customAttrValues }];
                      });
                      setCustomAttrName("");
                      setCustomAttrValues([]);
                    }}
                    className="px-4 py-2 rounded-md border border-gray-200 text-sm font-medium text-gray-800 hover:bg-amber-50"
                  >
                    Save Custom Option
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <section className="space-y-3">
              <h2 className="font-semibold text-gray-900">Attachments</h2>
              <div className="space-y-2">
                <label className="text-sm text-gray-700">Product images</label>
                <p className="text-xs text-gray-500">
                  Drag images to reorder. The first image will be used as the thumbnail.
                </p>
                <label className="border border-dashed border-gray-300 rounded-xl w-full h-48 flex flex-col items-center justify-center text-center cursor-pointer hover:border-amber-300 transition">
                  <ImageIcon className="w-6 h-6 text-gray-500 mb-2" />
                  <span className="text-sm text-gray-700">
                    Drop your image here, or <span className="font-semibold">Browse</span>
                  </span>
                  <span className="text-xs text-gray-500">SVG, PNG, JPG or GIF (Max 800x400 px)</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFile}
                  />
                </label>
                {files.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-[11px] text-gray-500">
                      Reorder the images to control which one appears first.
                    </div>
                    <div className="text-xs text-gray-600">
                      {files.length} file(s) selected
                    </div>
                    {filePreviews.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {filePreviews.map((p, index) => {
                          const isImage = p.type?.startsWith("image/");
                          return (
                            <div
                              key={p.url}
                              draggable
                              onDragStart={() => handleImageDragStart(index)}
                              onDragOver={(e: DragEvent<HTMLDivElement>) => e.preventDefault()}
                              onDrop={() => handleImageDrop(index)}
                              onDragEnd={handleImageDragEnd}
                              className={`border rounded-lg p-2 flex flex-col gap-2 bg-white ${
                                draggedFileIndex === index
                                  ? "border-amber-400 opacity-60"
                                  : "border-gray-200"
                              }`}
                            >
                              <div className="relative">
                                {isImage ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={p.url}
                                    alt={p.name}
                                    className="w-full h-28 object-cover rounded-md"
                                  />
                                ) : (
                                  <div className="w-full h-28 rounded-md bg-gray-100 flex items-center justify-center text-xs text-gray-600">
                                    {p.type || "file"}
                                  </div>
                                )}
                                <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-[#4B2F23] text-white text-[11px] font-semibold flex items-center justify-center shadow-sm">
                                  {index + 1}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFiles((prev) => prev.filter((_, fileIndex) => fileIndex !== index));
                                  }}
                                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 text-red-500 hover:text-red-700 flex items-center justify-center shadow-sm"
                                  aria-label={`Remove ${p.name}`}
                                >
                                  <X size={14} />
                                </button>
                              </div>
                              <div className="flex items-center justify-between gap-2">
                                <div className="min-w-0">
                                  <div className="text-[11px] text-gray-700 truncate" title={p.name}>
                                    {p.name}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="font-semibold text-gray-900">Organization</h2>
              <div className="space-y-2">
                <label className="text-sm text-gray-700">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-300"
                >
                  <option value="">Select category</option>
                  <option value="tops">Tops</option>
                  <option value="bottoms">Bottoms</option>
                  <option value="dresses">Dresses</option>
                  <option value="accessories">Accessories</option>
                </select>
              </div>
            </section>
          </div>
        </div>

        <div className="space-y-4">
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <span>
                <h2 className="font-semibold text-gray-900">Variants</h2>
                <p className="text-xs">Please set price and stock for each combination of option. You can remove any variant not wanted or valid</p></span>
              {removedVariants.length > 0 && (
                <button
                  type="button"
                  onClick={() => setRemovedVariants([])}
                  className="text-xs text-amber-700 hover:text-amber-900"
                >
                  Restore all
                </button>
              )}
            </div>
            {variantCombos.length === 0 ? (
              <p className="text-sm text-gray-500">
                Select colour and size options to generate variants.
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {variantCombos.map((v: VariantCombo) => (
                  <div
                    key={v.key}
                    className="border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-800 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span>{v.label}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setRemovedVariants((prev) => [...prev, v.key]);
                          setVariantOverrides((prev) => {
                            const next = { ...prev };
                            delete next[v.key];
                            return next;
                          });
                        }}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="0"
                        placeholder="Price"
                        value={variantOverrides[v.key]?.price ?? ""}
                        onChange={(e) =>
                          setVariantOverrides((prev) => ({
                            ...prev,
                            [v.key]: { ...prev[v.key], price: e.target.value },
                          }))
                        }
                        className="w-1/2 rounded-md border border-gray-200 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-amber-300"
                      />
                      <input
                        type="number"
                        min="0"
                        placeholder="Stock"
                        value={variantOverrides[v.key]?.quantity ?? ""}
                        onChange={(e) =>
                          setVariantOverrides((prev) => ({
                            ...prev,
                            [v.key]: { ...prev[v.key], quantity: e.target.value },
                          }))
                        }
                        className="w-1/2 rounded-md border border-gray-200 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-amber-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto sm:min-w-[240px] bg-[#FBC57C] hover:bg-[#e9a548] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-lg px-6 py-3 transition-colors"
            >
              {isSubmitting ? "Listing..." : "List Product"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
