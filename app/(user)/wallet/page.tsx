"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Eye,
  Download,
} from "lucide-react";
import ReusableTable from "../../../components/table/ReusableTable";
import { Button } from "../../../components/ui/Button";
import apiClient from "@/lib/api/axios";
import { BaseModal } from "@/components/modals/BaseModal";

type WalletOrder = {
  id: string;
  display_id: number;
  status: string;
  total: number;
  created_at: string;
  items?: Array<{
    id: string;
    title?: string;
    subtitle?: string | null;
    thumbnail?: string | null;
    quantity?: number;
    total?: number;
  }>;
};

type OrdersResponse = {
  orders: WalletOrder[];
  count: number;
  page: number;
  limit: number;
  offset: number;
};

const ORDERS_PER_PAGE = 10;
const TRANSACTIONS_PER_PAGE = 10;

type WalletTransaction = {
  id: string;
  order_id: string;
  version: number;
  amount: number;
  currency_code: string;
  reference: string;
  reference_id: string;
  created_at: string;
  updated_at: string;
};

type TransactionsResponse = {
  transactions: WalletTransaction[];
  count: number;
  page: number;
  limit: number;
  offset: number;
};

type WalletTableRow = {
  id: string | number;
  date: string;
  transactionId?: string;
  type?: string;
  typeIcon?: string;
  orderId?: string;
  items?: string;
  amount: string;
  status: string;
  rawOrder?: WalletOrder;
  rawTransaction?: WalletTransaction;
};

const MyWalletPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"transactions" | "orders">(
    "transactions"
  );
  const [transactionsPage, setTransactionsPage] = useState(1);
  const [ordersPage, setOrdersPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<WalletOrder | null>(null);
  const [selectedTransaction, setSelectedTransaction] =
    useState<WalletTransaction | null>(null);

  const {
    data: transactionsResponse,
    isLoading: transactionsLoading,
    error: transactionsError,
  } = useQuery<TransactionsResponse>({
    queryKey: ["wallet-transactions", transactionsPage, TRANSACTIONS_PER_PAGE],
    queryFn: async () => {
      const res = await apiClient.get(
        `/store/order-transactions?page=${transactionsPage}&limit=${TRANSACTIONS_PER_PAGE}`
      );
      return res.data;
    },
  });

  const {
    data: ordersResponse,
    isLoading: ordersLoading,
    error: ordersError,
  } = useQuery<OrdersResponse>({
    queryKey: ["wallet-orders", ordersPage, ORDERS_PER_PAGE],
    queryFn: async () => {
      const res = await apiClient.get(
        `/store/orders?page=${ordersPage}&limit=${ORDERS_PER_PAGE}`
      );
      return res.data;
    },
  });

  const toTitleCase = (value: string) =>
    value
      .split(/[_-\s]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

  const getTransactionTypeIcon = (reference: string) => {
    const normalized = reference.toLowerCase();
    if (normalized.includes("refund")) return "withdrawal";
    if (normalized.includes("deposit")) return "deposit";
    if (normalized.includes("escrow")) return "escrow";
    return "payment";
  };

  const formatMoney = (value?: number) => {
    if (value == null) return "₦0";
    return `₦${value.toLocaleString()}`;
  };

  const formatDate = (value?: string) => {
    if (!value) return "—";
    const date = new Date(value);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const openOrderFromTransaction = async (orderId: string) => {
    const existingOrder = ordersResponse?.orders?.find(
      (order) => order.id === orderId
    );

    if (existingOrder) {
      setSelectedTransaction(null);
      setSelectedOrder(existingOrder);
      return;
    }

    try {
      const res = await apiClient.get(`/store/orders/${orderId}`);
      const fetchedOrder = res.data?.order ?? res.data;
      if (fetchedOrder?.id) {
        setSelectedTransaction(null);
        setSelectedOrder(fetchedOrder);
      }
    } catch (error) {
      console.error("Failed to load order details", error);
    }
  };

  const transactions: WalletTableRow[] =
    transactionsResponse?.transactions?.map((transaction) => ({
      id: transaction.id,
      date: formatDate(transaction.created_at),
      transactionId: transaction.id.replace(/^ordtrx_/, ""),
      type: toTitleCase(transaction.reference),
      typeIcon: getTransactionTypeIcon(transaction.reference),
      amount: `₦${transaction.amount.toLocaleString()}`,
      status: "Successful",
      rawTransaction: transaction,
    })) || [];

  const orders: WalletTableRow[] =
    ordersResponse?.orders?.map((order) => {
      const itemCount = order.items?.length ?? 0;
      return {
        id: order.id,
        date: formatDate(order.created_at),
        orderId: order.id.replace(/^order_/, ""),
        items: `${itemCount} ${itemCount === 1 ? "item" : "items"}`,
        amount: `₦${order.total.toLocaleString()}`,
        status:
          order.status.charAt(0).toUpperCase() + order.status.slice(1),
        rawOrder: order,
      };
    }) || [];

  const columns = [
    { key: "date", label: "Date" },
    { key: "transactionId", label: "Transaction ID" },
    { key: "type", label: "Type" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
  ];

  const orderColumns = [
    { key: "date", label: "Date" },
    { key: "orderId", label: "Order ID" },
    { key: "items", label: "Items" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
  ];

  const getTypeIcon = (typeIcon: string) => {
    switch (typeIcon) {
      case "payment":
        return <ArrowUpRight className="text-green-600" size={18} />;
      case "deposit":
        return <ArrowDownLeft className="text-red-600" size={18} />;
      case "withdrawal":
        return <ArrowUpRight className="text-green-600" size={18} />;
      case "escrow":
        return <Clock className="text-yellow-600" size={18} />;
      default:
        return null;
    }
  };

  // Custom render for type column to include icon
  const renderTypeColumn = (row: WalletTableRow) => {
    return (
      <div className="flex items-center gap-2">
        {getTypeIcon(row.typeIcon || "")}
        <span>{row.type}</span>
      </div>
    );
  };

  // Modify columns to use custom rendering
  const modifiedColumns = columns.map((col) => {
    if (col.key === "type") {
      return { ...col, render: renderTypeColumn };
    }
    return col;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6 sm:mb-8 font-(family-name:--font-montserrat)">
        My Wallet
      </h1>

      {/* Top Section - Balance and Account Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4">
        {/* Available Balance Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <p className="text-sm text-gray-600 mb-3">Available Balance</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
            ₦350,000.00
          </h2>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-600">Today</span>
            <span className="text-green-600 font-medium">+ ₦250,000</span>
            <span className="text-red-600 font-medium">- ₦50,000</span>
          </div>
        </div>

        {/* Withdrawal Account Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm text-gray-600">Withdrawal Account</p>
            <button
              onClick={() => router.push("/wallet/create-account")}
              className="text-[#E9A556] text-sm font-medium hover:underline"
            >
              Add withdrawal account
            </button>
          </div>
          <div>
            <p className="font-semibold text-gray-800 mb-1">
              United Bank of Africa
            </p>
            <p className="text-sm text-gray-600 mb-1">Acc no: ********456</p>
            <p className="text-sm text-gray-600">Acc name: John Doe</p>
          </div>
        </div>
      </div>

      {/* Buttons Below Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8">
        <Button variant="default" onClick={() => router.push("/wallet/deposit")}>
          Deposit Funds
        </Button>
        <Button variant="default" outlined onClick={() => router.push("/wallet/withdraw")}>
          Withdraw Funds
        </Button>
      </div>

      {/* Transaction History */}
      <div className="mb-4 space-y-4">
        <div className="flex gap-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("transactions")}
            className={`pb-3 text-sm sm:text-base font-medium transition-colors ${activeTab === "transactions"
              ? "text-gray-900 border-b-2 border-[#5C4033]"
              : "text-gray-500"
              }`}
          >
            Transaction History
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 text-sm sm:text-base font-medium transition-colors ${activeTab === "orders"
              ? "text-gray-900 border-b-2 border-[#5C4033]"
              : "text-gray-500"
              }`}
          >
            Orders
          </button>
        </div>
        <h2 className="text-xl sm:text-2xl font-normal text-gray-800 font-(family-name:--font-montserrat)">
          {activeTab === "transactions" ? "Transaction History" : "Orders"}
        </h2>
      </div>

      {/* Reusable Table */}
      {activeTab === "transactions" && transactionsError ? (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {transactionsError instanceof Error
            ? transactionsError.message
            : "Failed to load transactions"}
        </div>
      ) : null}
      {activeTab === "orders" && ordersError ? (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {ordersError instanceof Error
            ? ordersError.message
            : "Failed to load orders"}
        </div>
      ) : null}
      <ReusableTable
        columns={activeTab === "transactions" ? modifiedColumns : orderColumns}
        data={activeTab === "transactions" ? transactions : orders}
        itemsPerPage={
          activeTab === "transactions"
            ? transactionsResponse?.limit ?? TRANSACTIONS_PER_PAGE
            : ordersResponse?.limit ?? ORDERS_PER_PAGE
        }
        currentPage={
          activeTab === "transactions" ? transactionsPage : ordersPage
        }
        totalPages={
          activeTab === "transactions"
            ? Math.max(
              1,
              Math.ceil(
                (transactionsResponse?.count ?? 0) /
                (transactionsResponse?.limit ?? TRANSACTIONS_PER_PAGE)
              )
            )
            : Math.max(
              1,
              Math.ceil(
                (ordersResponse?.count ?? 0) /
                (ordersResponse?.limit ?? ORDERS_PER_PAGE)
              )
            )
        }
        totalItems={
          activeTab === "transactions"
            ? transactionsResponse?.count
            : ordersResponse?.count
        }
        onPageChange={
          activeTab === "transactions" ? setTransactionsPage : setOrdersPage
        }
        showCheckbox={false}
        showActions={false}
        customActionColumn={(row) => (
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (activeTab === "transactions" && row.rawTransaction) {
                  setSelectedTransaction(row.rawTransaction);
                }
                if (activeTab === "orders" && row.rawOrder) {
                  setSelectedOrder(row.rawOrder);
                }
              }}
              className="text-gray-600 hover:text-gray-800 p-2"
            >
              <Eye size={18} />
            </button>
            <button className="text-gray-600 hover:text-gray-800 p-2">
              <Download size={18} />
            </button>
          </div>
        )}
      />
      {activeTab === "transactions" && transactionsLoading ? (
        <p className="mt-3 text-sm text-gray-500">Loading transactions...</p>
      ) : null}
      {activeTab === "orders" && ordersLoading ? (
        <p className="mt-3 text-sm text-gray-500">Loading orders...</p>
      ) : null}

      <BaseModal
        isOpen={Boolean(selectedTransaction)}
        onClose={() => setSelectedTransaction(null)}
        title="Transaction details"
        subtitle={
          selectedTransaction
            ? `Transaction ${selectedTransaction.id.replace(/^ordtrx_/, "")}`
            : undefined
        }
        maxWidth="xl"
      >
        {selectedTransaction && (
          <div className="p-6 space-y-6">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                  Amount
                </div>
                <div className="font-semibold text-gray-900">
                  {formatMoney(selectedTransaction.amount)}
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                  Reference
                </div>
                <div className="font-semibold text-gray-900">
                  {toTitleCase(selectedTransaction.reference)}
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                  Date
                </div>
                <div className="font-semibold text-gray-900">
                  {formatDate(selectedTransaction.created_at)}
                </div>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                  Transaction ID
                </div>
                <div className="font-semibold text-gray-900 break-all">
                  {selectedTransaction.id}
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                  Order ID
                </div>
                <button
                  type="button"
                  onClick={() =>
                    openOrderFromTransaction(selectedTransaction.order_id)
                  }
                  className="font-semibold text-[#E9A556] break-all text-left hover:underline"
                >
                  {selectedTransaction.order_id}
                </button>
              </div>
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                  Reference ID
                </div>
                <div className="font-semibold text-gray-900 break-all">
                  {selectedTransaction.reference_id}
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                  Currency
                </div>
                <div className="font-semibold text-gray-900 uppercase">
                  {selectedTransaction.currency_code}
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                  Version
                </div>
                <div className="font-semibold text-gray-900">
                  {selectedTransaction.version}
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                  Updated
                </div>
                <div className="font-semibold text-gray-900">
                  {formatDate(selectedTransaction.updated_at)}
                </div>
              </div>
            </div>
          </div>
        )}
      </BaseModal>

      <BaseModal
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        title="Order details"
        subtitle={
          selectedOrder
            ? `Order ${selectedOrder.id.replace(/^order_/, "")}`
            : undefined
        }
        maxWidth="2xl"
      >
        {selectedOrder && (
          <div className="p-6 space-y-6">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                  Status
                </div>
                <div className="font-semibold text-gray-900 capitalize">
                  {selectedOrder.status}
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                  Total
                </div>
                <div className="font-semibold text-gray-900">
                  {formatMoney(selectedOrder.total)}
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                  Date
                </div>
                <div className="font-semibold text-gray-900">
                  {formatDate(selectedOrder.created_at)}
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 p-4">
              <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                Order ID
              </div>
              <div className="font-semibold text-gray-900 break-all">
                {selectedOrder.id}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Items</h3>
              {selectedOrder.items?.length ? (
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-lg p-3 flex gap-3 items-start"
                    >
                      {item.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.thumbnail}
                          alt={item.title || "Order item"}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded bg-gray-100 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900">
                          {item.title || "Item"}
                        </div>
                        {item.subtitle ? (
                          <div className="text-sm text-gray-600">
                            {item.subtitle}
                          </div>
                        ) : null}
                        <div className="text-sm text-gray-700">
                          Qty: {item.quantity ?? 0}
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        {formatMoney(item.total)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500">No items found.</div>
              )}
            </div>
          </div>
        )}
      </BaseModal>
    </div>
  );
};

export default MyWalletPage;
