import apiClient from "@/lib/api/axios";
import type { Order, OrdersResponse } from "@/types/order";

export const orderService = {
  getOrders: async (page: number, limit: number): Promise<OrdersResponse> => {
    const res = await apiClient.get(`/store/orders?page=${page}&limit=${limit}`);
    return res.data;
  },

  getOrder: async (orderId: string): Promise<Order> => {
    const res = await apiClient.get(`/store/orders/${orderId}`);
    return res.data?.order ?? res.data;
  },

  // Orders placed by customers against this vendor's listed products.
  // Endpoint guessed from the existing /store/vendors/products convention —
  // confirm against the backend and adjust if it differs.
  getVendorOrders: async (
    vendorId: string,
    page: number,
    limit: number
  ): Promise<OrdersResponse> => {
    const res = await apiClient.get(
      `/store/vendors/orders?vendor_id=${vendorId}&page=${page}&limit=${limit}`
    );
    return res.data;
  },
};
