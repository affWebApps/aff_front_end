"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { orderService } from "@/services/orderService";
import type { Order, OrdersResponse, VendorOrdersResponse } from "@/types/order";

export const useOrders = (page: number, limit: number) =>
  useQuery<OrdersResponse>({
    queryKey: ["orders", page, limit],
    queryFn: () => orderService.getOrders(page, limit),
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  });

export const useOrder = (orderId: string | undefined) =>
  useQuery<Order>({
    queryKey: ["order", orderId],
    queryFn: () => orderService.getOrder(orderId as string),
    enabled: Boolean(orderId),
    staleTime: 60_000,
  });

export const useVendorOrders = (page: number, limit: number) =>
  useQuery<VendorOrdersResponse>({
    queryKey: ["vendor-orders", page, limit],
    queryFn: () => orderService.getVendorOrders(page, limit),
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  });
