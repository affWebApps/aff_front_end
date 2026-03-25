"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useCartMutations } from "@/hooks/useCart";
import HomeLayout from "@/app/(home)/layout";

function PaymentCallbackInner() {
  const search = useSearchParams();
  const router = useRouter();
  const referenceParam = search.get("reference") || "";
  const cartParam = search.get("cart_id") || "";
  const { data: cartData } = useCart();
  const { verifyPayment, completeCart } = useCartMutations();
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "failed">("idle");
  const [message, setMessage] = useState<string>("");
  const [order, setOrder] = useState<any>(null);
  const [verifyStatus, setVerifyStatus] = useState<"idle" | "pending" | "success" | "failed">("idle");
  const [verifyMessage, setVerifyMessage] = useState<string>("");
  const [completeStatus, setCompleteStatus] = useState<"idle" | "pending" | "success" | "failed">("idle");
  const [completeMessage, setCompleteMessage] = useState<string>("");
  const [manualLoading, setManualLoading] = useState(false);
  const [inlineToast, setInlineToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [storedReference] = useState<string>(() =>
    typeof window !== "undefined" ? localStorage.getItem("pendingReference") || "" : ""
  );
  const [storedCartId] = useState<string>(() =>
    typeof window !== "undefined" ? localStorage.getItem("pendingCartId") || "" : ""
  );

  const reference = referenceParam || storedReference;
  const cart_id = cartParam || storedCartId;
  const hasAttempted = useRef(false);

  const showToast = (msg: string, type: "success" | "error" = "error") => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(
      new CustomEvent("showToast", {
        detail: { message: msg, type },
      })
    );
    setInlineToast({ message: msg, type });
    setTimeout(() => setInlineToast(null), 3500);
  };

  const persistOrderAndRedirect = (ord: any) => {
    if (typeof window === "undefined" || !ord?.id) return;
    localStorage.setItem("lastOrderPayload", JSON.stringify(ord));
    localStorage.removeItem("pendingReference");
    localStorage.removeItem("pendingCartId");
    router.push(`/orders/${ord.id}`);
  };

  const effectiveCartId = useMemo(
    () => cart_id || storedCartId || cartData?.cart?.id || "",
    [cart_id, storedCartId, cartData?.cart?.id]
  );

  const isProcessing =
    manualLoading ||
    status === "pending" ||
    verifyStatus === "pending" ||
    completeStatus === "pending";

  const processPayment = async () => {
    if (!reference) return null;
    setStatus("pending");
    setVerifyStatus("pending");
    setVerifyMessage("");
    setCompleteStatus("idle");
    setCompleteMessage("");
    try {
      const res = await verifyPayment.mutateAsync(
        effectiveCartId ? { reference, cart_id: effectiveCartId } : { reference }
      );
      const success = res?.status === true && res?.data?.status === "success";
      setVerifyStatus(success ? "success" : "failed");
      const msg = success ? "Payment verified successfully." : "Payment verification failed.";
      setVerifyMessage(msg);
      setMessage(msg);
      if (!success) {
        setStatus("failed");
        showToast(msg, "error");
        return null;
      }
      setCompleteStatus("pending");
      setCompleteMessage("Completing order...");
      try {
        const orderRes = await completeCart.mutateAsync(reference);
        const resolvedOrder =
          orderRes?.completion?.order ??
          orderRes?.order ??
          orderRes;
        setOrder(resolvedOrder);
        setCompleteStatus("success");
        setCompleteMessage("Order completed successfully.");
        setStatus("success");
        localStorage.removeItem("pendingReference");
        localStorage.removeItem("pendingCartId");
        setMessage("Payment verified and order completed.");
        return resolvedOrder;
      } catch (err: any) {
        setCompleteStatus("failed");
        const cMsg = "Order completion failed. Please contact support.";
        setCompleteMessage(cMsg);
        setStatus("failed");
        showToast(cMsg, "error");
        return null;
      }
    } catch {
      setStatus("failed");
      if (verifyStatus !== "success") setVerifyStatus("failed");
      if (completeStatus !== "success") setCompleteStatus("failed");
      const msg = "Payment verification failed.";
      setVerifyMessage((prev) => prev || msg);
      setCompleteMessage((prev) => prev || "Order completion failed");
      setMessage(msg);
      showToast(msg, "error");
      return null;
    }
  };

  useEffect(() => {
    const run = async () => {
      if (!reference) return;
      if (hasAttempted.current) return;
      hasAttempted.current = true;
      const ord = await processPayment();
      if (ord) persistOrderAndRedirect(ord);
    };
    run();
  }, [reference, effectiveCartId]);

  const formatMoney = (value?: number) => {
    if (value == null) return "₦0";
    return `₦${value.toLocaleString()}`;
  };

  const renderOrderItems = () => {
    if (!order?.items?.length) return null;
    return (
      <div className="text-left space-y-3">
        {order.items.map((item: any) => (
          <div key={item.id} className="border rounded-lg p-3 flex gap-3 items-start">
            {item.thumbnail && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.thumbnail} alt={item.title} className="w-16 h-16 object-cover rounded" />
            )}
            <div className="flex-1">
              <div className="font-semibold text-gray-900">{item.title}</div>
              <div className="text-sm text-gray-600">{item.subtitle}</div>
              <div className="text-sm text-gray-700">Qty: {item.quantity}</div>
              <div className="text-sm font-semibold text-gray-900">{formatMoney(item.total)}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <HomeLayout>
      <div className="min-h-screen flex items-center justify-center bg-orange-50 px-4">
        <div className="max-w-2xl w-full bg-white shadow-lg rounded-2xl p-6 space-y-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Payment Status</h1>
          <p className="text-sm text-gray-600">Reference: {reference || "(missing)"}</p>

          <div className="space-y-2 text-left">
            <div className="flex items-center gap-2">
              <span
                className={`w-3 h-3 rounded-full ${verifyStatus === "success"
                  ? "bg-green-500"
                  : verifyStatus === "failed"
                    ? "bg-red-500"
                    : verifyStatus === "pending"
                      ? "bg-amber-400"
                      : "bg-gray-300"
                  }`}
              />
              <span className="text-sm text-gray-800">
                {verifyStatus === "pending"
                  ? "Verifying payment…"
                  : verifyStatus === "success"
                    ? verifyMessage || "Payment verified."
                    : verifyStatus === "failed"
                      ? verifyMessage || "Payment verification failed."
                      : "Waiting to verify"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`w-3 h-3 rounded-full ${completeStatus === "success"
                  ? "bg-green-500"
                  : completeStatus === "failed"
                    ? "bg-red-500"
                    : completeStatus === "pending"
                      ? "bg-amber-400"
                      : "bg-gray-300"
                  }`}
              />
              <span className="text-sm text-gray-800">
                {completeStatus === "pending"
                  ? "Completing order…"
                  : completeStatus === "success"
                    ? completeMessage || "Order completed."
                    : completeStatus === "failed"
                      ? completeMessage || "Order completion failed."
                      : "Waiting to complete order"}
              </span>
            </div>
          </div>

          {order && (
            <div className="text-left space-y-4">
              <div className="space-y-1 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Order ID</span>
                  <span className="font-semibold text-gray-900">{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status</span>
                  <span className="font-semibold text-gray-900 capitalize">{order.status}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total</span>
                  <span className="font-semibold text-gray-900">{formatMoney(order.total)}</span>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {order.shipping_address && (
                  <div className="border rounded-lg p-3">
                    <div className="font-semibold text-gray-900 mb-1">Shipping Address</div>
                    {Object.entries({
                      Name: `${order.shipping_address.first_name ?? ""} ${order.shipping_address.last_name ?? ""}`.trim(),
                      Address: order.shipping_address.address_1,
                      City: order.shipping_address.city,
                      State: order.shipping_address.province,
                      Country: order.shipping_address.country_code,
                      "Postal Code": order.shipping_address.postal_code,
                      Phone: order.shipping_address.phone,
                    }).map(([label, value]) => (
                      value ? (
                        <div key={label} className="flex justify-between text-xs text-gray-700">
                          <span>{label}</span>
                          <span className="font-semibold text-gray-900 text-right">{value}</span>
                        </div>
                      ) : null
                    ))}
                  </div>
                )}

                {order.billing_address && (
                  <div className="border rounded-lg p-3">
                    <div className="font-semibold text-gray-900 mb-1">Billing Address</div>
                    {Object.entries({
                      Name: `${order.billing_address.first_name ?? ""} ${order.billing_address.last_name ?? ""}`.trim(),
                      Address: order.billing_address.address_1,
                      City: order.billing_address.city,
                      State: order.billing_address.province,
                      Country: order.billing_address.country_code,
                      "Postal Code": order.billing_address.postal_code,
                      Phone: order.billing_address.phone,
                    }).map(([label, value]) => (
                      value ? (
                        <div key={label} className="flex justify-between text-xs text-gray-700">
                          <span>{label}</span>
                          <span className="font-semibold text-gray-900 text-right">{value}</span>
                        </div>
                      ) : null
                    ))}
                  </div>
                )}
              </div>

              <div className="font-semibold text-gray-900">Items</div>
              {renderOrderItems()}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <button
              onClick={() => router.push("/cart")}
              className="w-full py-3 bg-[#FAB75B] text-white font-semibold rounded-lg hover:bg-[#e9a548] transition-colors"
            >
              Return to Cart
            </button>
            {order?.id ? (
              <button
                onClick={() => persistOrderAndRedirect(order)}
                className="w-full py-3 border border-[#FAB75B] text-[#FAB75B] font-semibold rounded-lg hover:bg-orange-50 transition-colors"
              >
                View Order
              </button>
            ) : (
              <button
                disabled={isProcessing || !reference}
                onClick={async () => {
                  if (!reference || isProcessing) return;
                  try {
                    setManualLoading(true);
                    const ord = await processPayment();
                    if (ord) persistOrderAndRedirect(ord);
                  } catch {
                    const msg = "Payment verification failed.";
                    setStatus("failed");
                    setMessage(msg);
                    showToast(msg, "error");
                  } finally {
                    setManualLoading(false);
                  }
                }}
                className="w-full py-3 border border-[#FAB75B] text-[#FAB75B] font-semibold rounded-lg hover:bg-orange-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isProcessing ? "Checking payment..." : "I have paid"}
              </button>
            )}
            <button
              onClick={() => router.push("/")}
              className="w-full py-3 border border-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading payment status...</div>}>
      <PaymentCallbackInner />
    </Suspense>
  );
}
