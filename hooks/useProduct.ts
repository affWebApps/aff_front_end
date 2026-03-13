"use client";

import { useQuery } from "@tanstack/react-query";

export type ProductVariant = {
  id: string;
  title: string;
  calculated_price?: {
    calculated_amount: number;
    currency_code: string;
  };
};

export type ProductDetail = {
  id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  images?: { url: string }[];
  variants?: ProductVariant[];
  options?: any;
};

type ProductResponse = { product: ProductDetail };

const fetchProduct = async (id: string) => {
  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!backendUrl) throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");

  const res = await fetch(`${backendUrl}/store/products/${id}`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`Product request failed (${res.status})`);
  const data = (await res.json()) as ProductResponse;
  if (!data.product) throw new Error("Product not found");
  return data.product;
};

export const useProduct = (id: string | null) =>
  useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id as string),
    enabled: Boolean(id),
    staleTime: 60_000,
  });
