"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useOrder } from "@/hooks/useOrders";
import type { OrderAddress } from "@/types/order";
import { getFulfillmentStatus, getFulfillmentStatusColor } from "@/utils/orderFulfillment";

const getStatusColor = (status: string) => {
  const normalized = (status || "").toLowerCase();
  switch (normalized) {
    case "completed":
    case "delivered":
    case "captured":
    case "fulfilled":
      return "bg-green-100 text-green-700";
    case "pending":
    case "not_fulfilled":
    case "awaiting":
      return "bg-yellow-100 text-yellow-700";
    case "canceled":
    case "cancelled":
    case "failed":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const formatMoney = (value?: number, currency?: string) => {
  if (value == null) return "—";
  const symbol = currency?.toLowerCase() === "usd" ? "$" : "₦";
  return `${symbol}${value.toLocaleString()}`;
};

const formatDate = (value?: string) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatAddress = (address?: OrderAddress | null) => {
  if (!address) return null;
  return {
    Name: `${address.first_name ?? ""} ${address.last_name ?? ""}`.trim() || "—",
    Address: [address.address_1, address.address_2].filter(Boolean).join(", "),
    City: address.city,
    State: address.province,
    Country: address.country_code?.toUpperCase(),
    "Postal Code": address.postal_code,
    Phone: address.phone,
  };
};

const OrderDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const orderId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const { data: order, isLoading, error } = useOrder(orderId);

  const shippingAddress = formatAddress(order?.shipping_address);
  const billingAddress = formatAddress(order?.billing_address);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <button
        onClick={() => router.push("/products?tab=orders")}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={16} />
        Back to Orders
      </button>

      {isLoading ? (
        <p className="text-sm text-gray-500">Loading order...</p>
      ) : error ? (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error instanceof Error ? error.message : "Failed to load order"}
        </div>
      ) : !order ? (
        <div className="text-sm text-gray-500">Order not found.</div>
      ) : (
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 font-(family-name:--font-montserrat)">
              Order #{order.display_id}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Placed on {formatDate(order.created_at)}
            </p>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                Total
              </div>
              <div className="font-semibold text-gray-900">
                {formatMoney(order.total, order.currency_code)}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                Items
              </div>
              <div className="font-semibold text-gray-900">
                {order.items?.length ?? 0}
              </div>
            </div>
            {order.payment_status ? (
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                  Payment
                </div>
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(
                    order.payment_status
                  )}`}
                >
                  {order.payment_status}
                </span>
              </div>
            ) : null}
            {(() => {
              const fulfillmentStatus = getFulfillmentStatus(order);
              return (
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                  <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                    Fulfillment
                  </div>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getFulfillmentStatusColor(
                      fulfillmentStatus
                    )}`}
                  >
                    {fulfillmentStatus.replace(/_/g, " ")}
                  </span>
                </div>
              );
            })()}
          </div>

          {/* Items */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Items</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {order.items?.length ? (
                order.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 flex gap-4 items-start"
                  >
                    {item.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded bg-gray-100 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900">
                        {item.title}
                      </div>
                      {item.subtitle ? (
                        <div className="text-sm text-gray-600">
                          {item.subtitle}
                        </div>
                      ) : null}
                      {item.variant_sku ? (
                        <div className="text-xs text-gray-400">
                          SKU: {item.variant_sku}
                        </div>
                      ) : null}
                      <div className="text-sm text-gray-700 mt-1">
                        Qty: {item.quantity} ×{" "}
                        {formatMoney(item.unit_price, order.currency_code)}
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                      {formatMoney(item.total, order.currency_code)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-sm text-gray-500">No items found.</div>
              )}
            </div>

            {/* Totals breakdown */}
            <div className="p-4 border-t border-gray-200 space-y-1.5 max-w-xs ml-auto text-sm">
              {order.subtotal != null ? (
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatMoney(order.subtotal, order.currency_code)}</span>
                </div>
              ) : null}
              {order.shipping_total != null ? (
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{formatMoney(order.shipping_total, order.currency_code)}</span>
                </div>
              ) : null}
              {order.tax_total != null ? (
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>{formatMoney(order.tax_total, order.currency_code)}</span>
                </div>
              ) : null}
              {order.discount_total ? (
                <div className="flex justify-between text-gray-600">
                  <span>Discount</span>
                  <span>-{formatMoney(order.discount_total, order.currency_code)}</span>
                </div>
              ) : null}
              <div className="flex justify-between font-semibold text-gray-900 pt-1.5 border-t border-gray-100">
                <span>Total</span>
                <span>{formatMoney(order.total, order.currency_code)}</span>
              </div>
            </div>
          </div>

          {/* Addresses */}
          {(shippingAddress || billingAddress) && (
            <div className="grid gap-4 md:grid-cols-2">
              {shippingAddress ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Shipping Address
                  </h3>
                  <div className="space-y-1 text-sm">
                    {Object.entries(shippingAddress).map(([label, value]) =>
                      value ? (
                        <div key={label} className="flex justify-between gap-4">
                          <span className="text-gray-500">{label}</span>
                          <span className="text-gray-900 text-right">
                            {value}
                          </span>
                        </div>
                      ) : null
                    )}
                  </div>
                </div>
              ) : null}
              {billingAddress ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Billing Address
                  </h3>
                  <div className="space-y-1 text-sm">
                    {Object.entries(billingAddress).map(([label, value]) =>
                      value ? (
                        <div key={label} className="flex justify-between gap-4">
                          <span className="text-gray-500">{label}</span>
                          <span className="text-gray-900 text-right">
                            {value}
                          </span>
                        </div>
                      ) : null
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* Meta */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-sm text-gray-600 space-y-1">
            <div className="flex justify-between gap-4">
              <span>Order ID</span>
              <span className="text-gray-900 break-all text-right">
                {order.id}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Email</span>
              <span className="text-gray-900 text-right">{order.email}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailPage;
