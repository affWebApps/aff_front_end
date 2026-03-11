"use client";
import React, { useState } from "react";
import { Plus } from "lucide-react";
import ReusableTable from "../../../components/table/ReusableTable";
import { Button } from "../../../components/ui/Button";

interface Product {
  id: number;
  image: string;
  name: string;
  price: string;
  stock: number;
  listingDate: string;
  status: string;
}

const MyProductsPage = () => {
  const [activeTab, setActiveTab] = useState("listed");

  const columns = [
    { key: "image", label: "Product Image" },
    { key: "name", label: "Product name" },
    { key: "price", label: "Price" },
    { key: "stock", label: "Stock" },
    { key: "listingDate", label: "Listing Date" },
    { key: "status", label: "Status" },
  ];

  const products: Product[] = [
    {
      id: 1,
      image: "/images/gal1.jpg",
      name: "Gucci Sunglasses",
      price: "₦12,000",
      stock: 7,
      listingDate: "Feb 12, 2024",
      status: "In stock",
    },
    {
      id: 2,
      image: "/images/gal1.jpg",
      name: "Milkmaid dress",
      price: "₦7,000",
      stock: 10,
      listingDate: "Feb 12, 2024",
      status: "In stock",
    },
    {
      id: 3,
      image: "/images/gal1.jpg",
      name: "2 in 1 necklace",
      price: "₦25,000",
      stock: 4,
      listingDate: "Feb 12, 2024",
      status: "Low in stock",
    },
    {
      id: 4,
      image: "/images/gal1.jpg",
      name: "Hermes male palm",
      price: "₦15,000",
      stock: 0,
      listingDate: "Feb 12, 2024",
      status: "Out of stock",
    },
    {
      id: 5,
      image: "/images/gal1.jpg",
      name: "Head band",
      price: "₦3,000",
      stock: 12,
      listingDate: "Feb 12, 2024",
      status: "In stock",
    },
    {
      id: 6,
      image: "/images/gal1.jpg",
      name: "Jean Jacket",
      price: "₦17,000",
      stock: 5,
      listingDate: "Feb 12, 2024",
      status: "Low in stock",
    },
    {
      id: 7,
      image: "/images/gal1.jpg",
      name: "Female baggy Jeans",
      price: "₦27,000",
      stock: 10,
      listingDate: "Feb 12, 2024",
      status: "In stock",
    },
    {
      id: 8,
      image: "/images/gal1.jpg",
      name: "Nike sneakers",
      price: "₦30,000",
      stock: 15,
      listingDate: "Feb 12, 2024",
      status: "In stock",
    },
    {
      id: 9,
      image: "/images/gal1.jpg",
      name: "Nike sneakers",
      price: "₦30,000",
      stock: 2,
      listingDate: "Feb 12, 2024",
      status: "Low in stock",
    },
    {
      id: 10,
      image: "/images/gal1.jpg",
      name: "Nike sneakers",
      price: "₦30,000",
      stock: 0,
      listingDate: "Feb 12, 2024",
      status: "Out of stock",
    },
  ];

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
            className={`pb-3 px-1 whitespace-nowrap ${
              activeTab === "listed"
                ? "border-b-2 border-gray-800 text-gray-800 font-medium font-(family-name:--font-montserrat)"
                : "text-gray-500"
            }`}
          >
            Listed Products
          </button>
          <button
            onClick={() => setActiveTab("ordered")}
            className={`pb-3 px-1 whitespace-nowrap ${
              activeTab === "ordered"
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
          120 Total Products
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
