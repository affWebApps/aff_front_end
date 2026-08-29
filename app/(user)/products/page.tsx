"use client";
import React, { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Eye } from "lucide-react";
import ReusableTable from "../../../components/table/ReusableTable";
import { Button } from "../../../components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/axios";
import { BaseModal } from "@/components/modals/BaseModal";
import { useDeleteVendorProduct } from "@/hooks/useProducts";
import { useOrders, useVendorOrders } from "@/hooks/useOrders";
import { getFulfillmentStatus, getFulfillmentStatusColor } from "@/utils/orderFulfillment";
import type { Order } from "@/types/order";

interface Product {
  id: string;
  image?: string | null;
  name: string;
  price?: string | number;
  stock?: string | number;
  listingDate?: string;
  status?: string;
}

interface OrderRow {
  id: string;
  orderNumber: string;
  date: string;
  items: string;
  amount: string;
  status: string;
  statusRaw: string;
}

const ORDERS_PER_PAGE = 10;

type ProductsTab = "listed" | "my-orders" | "received";

const TAB_FROM_QUERY: Record<string, ProductsTab> = {
  orders: "my-orders",
  "my-orders": "my-orders",
  received: "received",
};

const MyProductsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = TAB_FROM_QUERY[searchParams.get("tab") ?? ""] ?? "listed";
  const [activeTab, setActiveTab] = useState<ProductsTab>(initialTab);
  const [ordersPage, setOrdersPage] = useState(1);
  const [receivedOrdersPage, setReceivedOrdersPage] = useState(1);
  const [productPendingDelete, setProductPendingDelete] = useState<Product | null>(null);
  const [deleteStep, setDeleteStep] = useState<"idle" | "confirm" | "final">("idle");
  const { user } = useAuthStore();
  const vendorId = (user as any)?.vendor_id || (user as any)?.vendorId;
  const deleteProduct = useDeleteVendorProduct();

  const switchTab = (tab: ProductsTab) => {
    setActiveTab(tab);
    router.replace(tab === "listed" ? "/products" : `/products?tab=${tab}`);
  };

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

  const {
    data: ordersResponse,
    isLoading: ordersLoading,
    error: ordersError,
  } = useOrders(ordersPage, ORDERS_PER_PAGE);

  const formatMoney = (value?: number, currency?: string) => {
    if (value == null) return "—";
    const symbol = currency?.toLowerCase() === "usd" ? "$" : "₦";
    return `${symbol}${value.toLocaleString()}`;
  };

  const toTitleCase = (value: string) =>
    value
      .split(/[_-\s]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

  const toOrderRows = (orders?: Order[]): OrderRow[] =>
    (orders || []).map((order) => {
      const itemCount = order.items?.length ?? 0;
      const fulfillmentStatus = getFulfillmentStatus(order);
      return {
        id: order.id,
        orderNumber: `#${order.display_id}`,
        date: new Date(order.created_at).toLocaleDateString(),
        items: `${itemCount} ${itemCount === 1 ? "item" : "items"}`,
        amount: formatMoney(order.total, order.currency_code),
        status: toTitleCase(fulfillmentStatus),
        statusRaw: fulfillmentStatus,
      };
    });

  const orderRows: OrderRow[] = useMemo(
    () => toOrderRows(ordersResponse?.orders),
    [ordersResponse]
  );

  const {
    data: receivedOrdersResponse,
    isLoading: receivedOrdersLoading,
    error: receivedOrdersError,
  } = useVendorOrders(vendorId, receivedOrdersPage, ORDERS_PER_PAGE);

  const receivedOrderRows: OrderRow[] = useMemo(
    () => toOrderRows(receivedOrdersResponse?.orders),
    [receivedOrdersResponse]
  );

  const orderColumns = [
    { key: "orderNumber", label: "Order" },
    { key: "date", label: "Date" },
    { key: "items", label: "Items" },
    { key: "amount", label: "Total" },
    {
      key: "status",
      label: "Status",
      render: (row: OrderRow) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getFulfillmentStatusColor(
            row.statusRaw
          )}`}
        >
          {row.status}
        </span>
      ),
    },
  ];

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
            onClick={() => switchTab("listed")}
            className={`pb-3 px-1 whitespace-nowrap ${activeTab === "listed"
              ? "border-b-2 border-gray-800 text-gray-800 font-medium font-(family-name:--font-montserrat)"
              : "text-gray-500"
              }`}
          >
            Listed Products
          </button>
          <button
            onClick={() => switchTab("my-orders")}
            className={`pb-3 px-1 whitespace-nowrap ${activeTab === "my-orders"
              ? "border-b-2 border-gray-800 text-gray-800 font-medium font-(family-name:--font-montserrat)"
              : "text-gray-500"
              }`}
          >
            My Orders
          </button>
          <button
            onClick={() => switchTab("received")}
            className={`pb-3 px-1 whitespace-nowrap ${activeTab === "received"
              ? "border-b-2 border-gray-800 text-gray-800 font-medium font-(family-name:--font-montserrat)"
              : "text-gray-500"
              }`}
          >
            Orders Received
          </button>
        </div>
      </div>

      {/* Table */}
      {activeTab === "listed" ? (
        <ReusableTable
          columns={columns}
          data={products}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          itemsPerPage={10}
        />
      ) : activeTab === "my-orders" ? (
        <>
          {ordersError ? (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 mb-4">
              {ordersError instanceof Error
                ? ordersError.message
                : "Failed to load orders"}
            </div>
          ) : null}
          <ReusableTable
            columns={orderColumns}
            data={orderRows}
            itemsPerPage={ordersResponse?.limit ?? ORDERS_PER_PAGE}
            currentPage={ordersPage}
            totalPages={Math.max(
              1,
              Math.ceil(
                (ordersResponse?.count ?? 0) /
                (ordersResponse?.limit ?? ORDERS_PER_PAGE)
              )
            )}
            totalItems={ordersResponse?.count}
            onPageChange={setOrdersPage}
            showCheckbox={false}
            showActions={false}
            customActionColumn={(row) => (
              <button
                onClick={() => router.push(`/products/orders/${row.id}`)}
                className="text-gray-600 hover:text-gray-800 p-2"
                aria-label="View order"
                title="View order"
              >
                <Eye size={18} />
              </button>
            )}
          />
          {ordersLoading ? (
            <p className="mt-3 text-sm text-gray-500">Loading orders...</p>
          ) : null}
          {!ordersLoading && orderRows.length === 0 ? (
            <p className="mt-3 text-sm text-gray-500">
              You haven&apos;t placed any orders yet.
            </p>
          ) : null}
        </>
      ) : (
        <>
          {receivedOrdersError ? (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 mb-4">
              {receivedOrdersError instanceof Error
                ? receivedOrdersError.message
                : "Failed to load orders received"}
            </div>
          ) : null}
          <ReusableTable
            columns={orderColumns}
            data={receivedOrderRows}
            itemsPerPage={receivedOrdersResponse?.limit ?? ORDERS_PER_PAGE}
            currentPage={receivedOrdersPage}
            totalPages={Math.max(
              1,
              Math.ceil(
                (receivedOrdersResponse?.count ?? 0) /
                (receivedOrdersResponse?.limit ?? ORDERS_PER_PAGE)
              )
            )}
            totalItems={receivedOrdersResponse?.count}
            onPageChange={setReceivedOrdersPage}
            showCheckbox={false}
            showActions={false}
            customActionColumn={(row) => (
              <button
                onClick={() => router.push(`/products/orders/${row.id}`)}
                className="text-gray-600 hover:text-gray-800 p-2"
                aria-label="View order"
                title="View order"
              >
                <Eye size={18} />
              </button>
            )}
          />
          {receivedOrdersLoading ? (
            <p className="mt-3 text-sm text-gray-500">Loading orders...</p>
          ) : null}
          {!receivedOrdersLoading && receivedOrderRows.length === 0 ? (
            <p className="mt-3 text-sm text-gray-500">
              No customer orders on your products yet.
            </p>
          ) : null}
        </>
      )}

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
