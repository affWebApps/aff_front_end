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
