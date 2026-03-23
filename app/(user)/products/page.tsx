"use client";
import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import ReusableTable from "../../../components/table/ReusableTable";
import { Button } from "../../../components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/axios";
import { BaseModal } from "@/components/modals/BaseModal";
import { useDeleteVendorProduct } from "@/hooks/useProducts";

interface Product {
  id: string;
  image?: string | null;
  name: string;
  price?: string | number;
  stock?: string | number;
  listingDate?: string;
  status?: string;
}

const MyProductsPage = () => {
  const [activeTab, setActiveTab] = useState("listed");
  const [productPendingDelete, setProductPendingDelete] = useState<Product | null>(null);
  const [deleteStep, setDeleteStep] = useState<"idle" | "confirm" | "final">("idle");
  const router = useRouter();
  const { user } = useAuthStore();
  const vendorId = (user as any)?.vendor_id || (user as any)?.vendorId;
  const deleteProduct = useDeleteVendorProduct();

  const columns = [
    { key: "image", label: "Product Image" },
    { key: "name", label: "Product name" },
    { key: "price", label: "Price" },
    { key: "stock", label: "Stock" },
    { key: "listingDate", label: "Listing Date" },
    { key: "status", label: "Status" },
  ];

  const { data: productResponse, isLoading } = useQuery({
    queryKey: ["vendor-products", vendorId],
    queryFn: async () => {
      const res = await apiClient.get(
        `/store/products-by-vendor?vendor_id=${vendorId}`
      );
      return res.data;
    },
    enabled: Boolean(vendorId),
  });

  const products = useMemo(() => {
    const list: Product[] = productResponse?.products || [];
    return list.map((p: any) => ({
      id: p.id,
      image: p.thumbnail,
      name: p.title,
      price: p.price ? `₦${p.price.toLocaleString()}` : "—",
      stock: "—",
      listingDate: p.created_at
        ? new Date(p.created_at).toLocaleDateString()
        : "—",
      status: p.status || "—",
    }));
  }, [productResponse]);

  const handleView = (product: Product) => {
    console.log("View:", product);
  };

  const handleEdit = (product: Product) => {
    router.push(`/products/${product.id}/edit`);
  };

  const handleDelete = (product: Product) => {
    setProductPendingDelete(product);
    setDeleteStep("confirm");
  };

  const closeDeleteFlow = () => {
    if (deleteProduct.isPending) return;
    setDeleteStep("idle");
    setProductPendingDelete(null);
  };

  const confirmFirstDeleteStep = () => {
    setDeleteStep("final");
  };

  const handleFinalDelete = async () => {
    if (!productPendingDelete?.id) return;
    try {
      await deleteProduct.mutateAsync(String(productPendingDelete.id));
      closeDeleteFlow();
    } catch (error) {
      console.error("Delete product failed:", error);
      alert("Failed to delete product. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex justify-between items-center gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 font-(family-name:--font-montserrat)">
          My Products
        </h1>
        <Button size="small" onClick={() => router.push("/products/new")}>
          <Plus size={16} className="sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">List Product</span>
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex gap-4 sm:gap-8 border-b border-gray-300 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("listed")}
            className={`pb-3 px-1 whitespace-nowrap ${activeTab === "listed"
                ? "border-b-2 border-gray-800 text-gray-800 font-medium font-(family-name:--font-montserrat)"
                : "text-gray-500"
              }`}
          >
            Listed Products
          </button>
          <button
            onClick={() => setActiveTab("ordered")}
            className={`pb-3 px-1 whitespace-nowrap ${activeTab === "ordered"
                ? "border-b-2 border-gray-800 text-gray-800 font-medium font-(family-name:--font-montserrat)"
                : "text-gray-500"
              }`}
          >
            Ordered Products
          </button>
        </div>
      </div>

      {/* Total and View All */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
        <h2 className="text-lg sm:text-xl font-medium text-gray-800">
          {isLoading ? "Loading products…" : `${products.length} Total Products`}
        </h2>
        <button className="text-[#E9A556] hover:underline text-sm font-medium">
          View all orders
        </button>
      </div>

      {/* Table */}
      <ReusableTable
        columns={columns}
        data={products}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        itemsPerPage={10}
      />

      <BaseModal
        isOpen={deleteStep === "confirm"}
        onClose={closeDeleteFlow}
        title="Delete product?"
        subtitle="This action cannot be reversed."
        maxWidth="md"
      >
        <div className="p-6 space-y-6">
          <p className="text-sm text-gray-700">
            You are about to delete
            <span className="font-semibold"> {productPendingDelete?.name || "this product"}</span>.
            Once deleted, it will be removed from your storefront and cannot be recovered.
          </p>
          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <button
              onClick={closeDeleteFlow}
              disabled={deleteProduct.isPending}
              className="w-full py-3 border border-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={confirmFirstDeleteStep}
              disabled={deleteProduct.isPending}
              className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Delete
            </button>
          </div>
        </div>
      </BaseModal>

      <BaseModal
        isOpen={deleteStep === "final"}
        onClose={closeDeleteFlow}
        title="Final confirmation"
        subtitle="This action cannot be undone."
        maxWidth="md"
      >
        <div className="p-6 space-y-6">
          <p className="text-sm text-gray-700">
            Please confirm that you want to permanently delete
            <span className="font-semibold"> {productPendingDelete?.name || "this product"}</span>.
            This is the last confirmation before the product is removed.
          </p>
          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <button
              onClick={() => setDeleteStep("confirm")}
              disabled={deleteProduct.isPending}
              className="w-full py-3 border border-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Go back
            </button>
            <button
              onClick={handleFinalDelete}
              disabled={deleteProduct.isPending}
              className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {deleteProduct.isPending ? "Deleting..." : "Delete permanently"}
            </button>
          </div>
        </div>
      </BaseModal>
    </div>
  );
};

export default MyProductsPage;
