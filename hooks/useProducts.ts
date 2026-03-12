"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

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
