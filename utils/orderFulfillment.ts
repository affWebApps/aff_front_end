import type { Order } from "@/types/order";

export type FulfillmentStatus =
  | "not_fulfilled"
  | "partially_fulfilled"
  | "fulfilled"
  | "partially_shipped"
  | "shipped"
  | "partially_delivered"
  | "delivered"
  | "canceled";

/**
 * Derives fulfillment status from item-level quantities when the order
 * payload doesn't carry a top-level `fulfillment_status` field (the
 * store/orders list endpoint omits it, unlike some detail responses).
 */
export const getFulfillmentStatus = (
  order: Pick<Order, "status" | "items" | "fulfillment_status">
): FulfillmentStatus => {
  if (order.fulfillment_status) {
    return order.fulfillment_status as FulfillmentStatus;
  }

  if (order.status?.toLowerCase() === "canceled") return "canceled";

  const totals = (order.items || []).reduce(
    (acc, item) => {
      const detail = item.detail;
      const quantity = detail?.quantity ?? item.quantity ?? 0;
      acc.quantity += quantity;
      acc.fulfilled += detail?.fulfilled_quantity ?? 0;
      acc.shipped += detail?.shipped_quantity ?? 0;
      acc.delivered += detail?.delivered_quantity ?? 0;
      return acc;
    },
    { quantity: 0, fulfilled: 0, shipped: 0, delivered: 0 }
  );

  if (totals.quantity === 0) return "not_fulfilled";

  if (totals.delivered >= totals.quantity) return "delivered";
  if (totals.delivered > 0) return "partially_delivered";

  if (totals.shipped >= totals.quantity) return "shipped";
  if (totals.shipped > 0) return "partially_shipped";

  if (totals.fulfilled >= totals.quantity) return "fulfilled";
  if (totals.fulfilled > 0) return "partially_fulfilled";

  return "not_fulfilled";
};

export const getFulfillmentStatusColor = (status: string) => {
  switch (status as FulfillmentStatus) {
    case "delivered":
    case "fulfilled":
      return "bg-green-100 text-green-700";
    case "shipped":
    case "partially_delivered":
    case "partially_shipped":
      return "bg-blue-100 text-blue-700";
    case "partially_fulfilled":
      return "bg-yellow-100 text-yellow-700";
    case "canceled":
      return "bg-red-100 text-red-700";
    case "not_fulfilled":
    default:
      return "bg-gray-100 text-gray-700";
  }
};
