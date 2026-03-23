"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api/axios";

export type ProductListItem = {
  id: string;
  title: string;
  thumbnail: string | null;
  price: number;
};

type ProductsResponse = {
  products: ProductListItem[];
  total?: number;
  pagination?: any
};

export type VendorProductImage = {
  id?: string;
  url: string;
};

export type VendorProductVariantPrice = {
  id?: string;
  currency_code: string;
  amount: number;
};

export type VendorProductVariant = {
  id: string;
  title: string;
  prices?: VendorProductVariantPrice[];
  calculated_price?: {
    calculated_amount: number;
    currency_code: string;
  };
};

export type VendorProductDetail = {
  id: string;
  title: string;
  handle?: string;
  description?: string | null;
  thumbnail?: string | null;
  images?: VendorProductImage[];
  variants?: VendorProductVariant[];
};

export type CreateVendorProductPayload = {
  variants: Array<{
    title: string;
    manage_inventory: boolean;
    allow_backorder: boolean;
    options: Record<string, string>;
    prices: Array<{
      amount: number;
      currency_code: string;
    }>;
    stock_quantity: number;
  }>;
  title: string;
  status: "published" | "draft";
  description: string;
  handle: string;
  shipping_profile_id: string;
  thumbnail: string;
  images: Array<{ url: string }>;
  options: Array<{
    title: string;
    values: string[];
  }>;
};

export type UpdateVendorProductPayload = {
  title: string;
  handle: string;
  description: string;
  thumbnail: string;
  images: Array<{
    id?: string;
    url: string;
  }>;
  variants: Array<{
    id: string;
    prices: Array<{
      id?: string;
      currency_code: string;
      amount: number;
    }>;
  }>;
};

const fetchProducts = async (page: number, limit: number) => {
  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!backendUrl) throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");

  const res = await fetch(
    `${backendUrl}/store/products?page=${page}&limit=${limit}&collection_id=null`,
    { headers: { "Content-Type": "application/json" }, cache: "no-store" }
  );

  if (!res.ok) throw new Error(`Products request failed (${res.status})`);
  const data = (await res.json()) as ProductsResponse;
  if (!Array.isArray(data.products)) throw new Error("Unexpected response shape for products");
  return data;
};

export const useProducts = (page: number, limit: number) =>
  useQuery<ProductsResponse>({
    queryKey: ["products", page, limit],
    queryFn: () => fetchProducts(page, limit),
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  });

const fetchVendorProduct = async (productId: string) => {
  const response = await apiClient.get(`/store/products/${productId}`);
  return (response.data?.product || response.data) as VendorProductDetail;
};

export const useVendorProduct = (productId: string | undefined) =>
  useQuery<VendorProductDetail>({
    queryKey: ["vendor-product", productId],
    queryFn: () => fetchVendorProduct(productId as string),
    enabled: Boolean(productId),
    staleTime: 60_000,
  });

const createVendorProduct = async (payload: CreateVendorProductPayload) => {
  const response = await apiClient.post("/store/vendors/products", payload);
  return response.data;
};

export const useCreateVendorProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createVendorProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

const updateVendorProduct = async ({
  productId,
  payload,
}: {
  productId: string;
  payload: UpdateVendorProductPayload;
}) => {
  const response = await apiClient.post(
    `/store/vendors/products/${productId}/update`,
    payload
  );
  return response.data;
};

export const useUpdateVendorProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateVendorProduct,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["vendor-products"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-product", variables.productId] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.productId] });
    },
  });
};

const deleteVendorProduct = async (productId: string) => {
  const response = await apiClient.delete(`/store/vendors/products/${productId}`);
  return response.data;
};

export const useDeleteVendorProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteVendorProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
