import apiClient from "@/lib/api/axios";
import type { Order, OrdersResponse, VendorOrdersResponse } from "@/types/order";

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
  // Vendor is resolved server-side from the auth token — no vendor_id param.
  getVendorOrders: async (
    page: number,
    limit: number
  ): Promise<VendorOrdersResponse> => {
    const res = await apiClient.get(
      `/store/vendors/orders?page=${page}&limit=${limit}`
    );
    return res.data;
  },
};
