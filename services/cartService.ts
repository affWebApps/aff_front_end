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
  shipping_methods?: { shipping_option_id?: string }[];
   shipping_address?: Record<string, any>;
   billing_address?: Record<string, any>;
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
  paymentSession: "/store/cart/payment-session",
  paymentVerify: "/store/paystack-verify",
  paymentProviders: "/store/payment-providers",
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
    const normalize = (addr?: Record<string, any>) => {
      if (!addr) return addr;
      const {
        firstName,
        lastName,
        street,
        apartment,
        state,
        postalCode,
        ...rest
      } = addr;
      return {
        ...rest,
        ...(firstName ? { first_name: firstName } : {}),
        ...(lastName ? { last_name: lastName } : {}),
        ...(street || apartment ? { address_1: [street, apartment].filter(Boolean).join(" ").trim() } : {}),
        ...(state ? { province: state } : {}),
        ...(postalCode ? { postal_code: postalCode } : {}),
      };
    };
    const { data } = await apiClient.post<CartResponse>(endpoints.updateAddresses, {
      cart_id: payload.cart_id,
      shipping_address: normalize(payload.shipping_address),
      billing_address: normalize(payload.billing_address),
    });
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

  createPaymentSession: async (payload: { provider_id: string; cart_id: string }) => {
    const { data } = await apiClient.post(endpoints.paymentSession, payload);
    return data;
  },

  verifyPayment: async (payload: { reference: string; cart_id: string }) => {
    const { data } = await apiClient.post(
      `${endpoints.paymentVerify}?reference=${encodeURIComponent(payload.reference)}`,
      { cart_id: payload.cart_id }
    );
    return data;
  },

  getPaymentProviders: async (region_id: string) => {
    const { data } = await apiClient.get<{ payment_providers: { id: string; is_enabled: boolean }[] }>(
      endpoints.paymentProviders,
      { params: { region_id } }
    );
    return data.payment_providers;
  },
};
