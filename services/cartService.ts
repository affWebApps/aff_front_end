/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "@/lib/api/axios";

export interface CartItem {
  id: string;
  title?: string;
  quantity: number;
  thumbnail?: string | null;
  unit_price?: number;
  variant_id?: string;
  product_id?: string;
  variant_title?: string;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total?: number;
  subtotal?: number;
  shipping_total?: number;
  currency_code?: string;
  item_count?: number;
}

export interface CartResponse {
  cart: Cart;
  item_count?: number;
}

const endpoints = {
  cart: "/store/cart",
  fullCart: "/store/full-cart",
  add: "/store/cart/add-to-cart",
  remove: "/store/cart/remove-item",
  updateItem: "/store/cart/update-item",
  updateAddresses: "/store/cart/update",
  options: "/store/cart/options",
  shippingMethod: "/store/cart/shipping-method",
  complete: "/store/cart/complete",
};

export const cartService = {
  getCart: async (): Promise<CartResponse> => {
    const { data } = await apiClient.get<CartResponse>(endpoints.cart);
    return data;
  },

  getFullCart: async (cart_id: string): Promise<CartResponse> => {
    const { data } = await apiClient.get<CartResponse>(endpoints.fullCart, {
      params: { cart_id },
    });
    return data;
  },

  addToCart: async (payload: {
    variant_id: string;
    quantity: number;
    cart_id?: string;
    product_id?: string;
  }): Promise<CartResponse> => {
    const { data } = await apiClient.post<CartResponse>(endpoints.add, payload);
    return data;
  },

  removeItem: async (payload: { cart_id: string; item_id: string }): Promise<CartResponse> => {
    const { data } = await apiClient.post<CartResponse>(endpoints.remove, payload);
    return data;
  },

  updateItemQty: async (payload: {
    cart_id: string;
    item_id: string;
    quantity: number;
  }): Promise<CartResponse> => {
    const { data } = await apiClient.post<CartResponse>(endpoints.updateItem, payload);
    return data;
  },

  updateAddresses: async (payload: {
    cart_id: string;
    shipping_address?: Record<string, any>;
    billing_address?: Record<string, any>;
  }): Promise<CartResponse> => {
    const { data } = await apiClient.post<CartResponse>(endpoints.updateAddresses, payload);
    return data;
  },

  getShippingOptions: async (cart_id: string) => {
    const { data } = await apiClient.get<{ shipping_options: any[] }>(endpoints.options, {
      params: { cart_id },
    });
    return data.shipping_options;
  },

  addShippingMethod: async (payload: { option_id: string; cart_id: string }): Promise<CartResponse> => {
    const { data } = await apiClient.post<CartResponse>(endpoints.shippingMethod, payload);
    return data;
  },

  completeCart: async (cart_id: string) => {
    const { data } = await apiClient.post(endpoints.complete, { cart_id });
    return data;
  },
};

