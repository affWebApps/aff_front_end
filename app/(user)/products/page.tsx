"use client";
import React, { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import ReusableTable from "../../../components/table/ReusableTable";
import { Button } from "../../../components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/axios";

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
  const { user } = useAuthStore();
  const vendorId = (user as any)?.vendor_id || (user as any)?.vendorId;

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
    console.log("Edit:", product);
  };

  const handleDelete = (product: Product) => {
    console.log("Delete:", product);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex justify-between items-center gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 font-(family-name:--font-montserrat)">
          My Products
        </h1>
        <Button size="small">
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
    </div>
  );
};

export default MyProductsPage;
