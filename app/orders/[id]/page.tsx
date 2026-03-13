"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import HomeLayout from "@/app/(home)/layout";

export default function OrderViewPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("lastOrderPayload");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (!orderId || parsed?.id === orderId) {
          setOrder(parsed);
        }
      } catch (err) {
        console.error("Unable to parse stored order", err);
      }
    }
  }, [orderId]);

  const formatMoney = (value?: number) => {
    if (value == null) return "₦0";
    return `₦${value.toLocaleString()}`;
  };

  return (
    <HomeLayout>
      <div className="min-h-screen bg-orange-50 px-4 py-10">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 text-sm font-semibold text-white bg-[#FAB75B] rounded-lg hover:bg-[#e9a548] transition-colors"
            >
              Go Home
            </button>
          </div>

          {!order && (
            <div className="text-gray-600">
              No order found. Please complete a payment first, then return to this page.
            </div>
          )}

          {order && (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="border rounded-lg p-3 text-sm text-gray-800 space-y-1">
                  <div className="flex justify-between"><span>Order ID</span><span className="font-semibold">{order.id}</span></div>
                  <div className="flex justify-between"><span>Status</span><span className="font-semibold capitalize">{order.status}</span></div>
                  <div className="flex justify-between"><span>Total</span><span className="font-semibold">{formatMoney(order.total)}</span></div>
                </div>
                <div className="border rounded-lg p-3 text-sm text-gray-800 space-y-1">
                  <div className="font-semibold">Shipping</div>
                  <div>{order.shipping_address?.address_1}</div>
                  <div>{order.shipping_address?.city}</div>
                  <div>{order.shipping_address?.province}</div>
                  <div>{order.shipping_address?.country_code?.toUpperCase?.()}</div>
                </div>
              </div>

              <div>
                <div className="font-semibold text-gray-900 mb-2">Items</div>
                <div className="space-y-2">
                  {order.items?.map((item: any) => (
                    <div key={item.id} className="border rounded-lg p-3 flex gap-3 items-start">
                      {item.thumbnail && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.thumbnail} alt={item.title} className="w-16 h-16 object-cover rounded" />
                      )}
                      <div className="flex-1 text-sm text-gray-800 space-y-1">
                        <div className="font-semibold">{item.title}</div>
                        <div className="text-gray-600">{item.subtitle}</div>
                        <div>Qty: {item.quantity}</div>
                        <div className="font-semibold">{formatMoney(item.total)}</div>
                      </div>
                    </div>
                  )) || <div className="text-gray-600">No items</div>}
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-semibold text-gray-900">Raw JSON</div>
                <pre className="bg-gray-900 text-gray-100 text-xs p-3 rounded-lg overflow-auto max-h-96">
                  {JSON.stringify(order, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </HomeLayout>
  );
}
