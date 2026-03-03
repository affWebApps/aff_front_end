"use client";

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { cartService, CartResponse } from "@/services/cartService";

export const CART_KEY = ["cart"] as const;

type UseCartOptions = Pick<UseQueryOptions<CartResponse>, "enabled" | "select" | "staleTime">;

export const useCart = (options?: UseCartOptions) =>
  useQuery<CartResponse>({
    queryKey: CART_KEY,
    queryFn: cartService.getCart,
    staleTime: 60_000,
    retry: 1,
    ...options,
  });

export const useCartMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: CART_KEY });

  const addItem = useMutation({
    mutationFn: cartService.addToCart,
    onSuccess: invalidate,
  });

  const removeItem = useMutation({
    mutationFn: cartService.removeItem,
    onSuccess: invalidate,
  });

  const updateQty = useMutation({
    mutationFn: cartService.updateItemQty,
    onSuccess: invalidate,
  });

  const updateAddresses = useMutation({
    mutationFn: cartService.updateAddresses,
    onSuccess: invalidate,
  });

  const addShipping = useMutation({
    mutationFn: cartService.addShippingMethod,
    onSuccess: invalidate,
  });

  const completeCart = useMutation({
    mutationFn: (cart_id: string) => cartService.completeCart(cart_id),
    onSuccess: invalidate,
  });

  return { addItem, removeItem, updateQty, updateAddresses, addShipping, completeCart };
};
