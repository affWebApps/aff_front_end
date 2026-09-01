export interface OrderItemDetail {
  quantity: number;
  fulfilled_quantity: number;
  shipped_quantity: number;
  delivered_quantity: number;
}

export interface OrderItem {
  id: string;
  title: string;
  subtitle?: string | null;
  thumbnail?: string | null;
  variant_id?: string | null;
  product_id?: string | null;
  product_title?: string | null;
  variant_sku?: string | null;
  variant_title?: string | null;
  quantity: number;
  unit_price: number;
  subtotal?: number;
  total: number;
  tax_total?: number;
  discount_total?: number;
  detail?: OrderItemDetail;
}

export interface OrderAddress {
  first_name?: string | null;
  last_name?: string | null;
  address_1?: string | null;
  address_2?: string | null;
  city?: string | null;
  province?: string | null;
  postal_code?: string | null;
  country_code?: string | null;
  phone?: string | null;
}

export interface OrderShippingMethod {
  id: string;
  name: string;
  amount?: number;
  total?: number;
}

export interface Order {
  id: string;
  display_id: number;
  email: string;
  status: string;
  payment_status?: string;
  fulfillment_status?: string;
  currency_code: string;
  subtotal?: number;
  shipping_total?: number;
  tax_total?: number;
  discount_total?: number;
  total: number;
  created_at: string;
  updated_at?: string;
  items: OrderItem[];
  shipping_address?: OrderAddress | null;
  billing_address?: OrderAddress | null;
  shipping_methods?: OrderShippingMethod[];
}

export interface OrdersResponse {
  orders: Order[];
  count: number;
  page: number;
  limit: number;
  offset: number;
}

// Row shape returned by GET /store/vendors/orders — a lighter summary
// than the customer-facing Order (no line items, just a count).
export interface VendorOrderListItem {
  id: string;
  display_id: number;
  status: string;
  email: string;
  currency_code: string;
  created_at: string;
  item_count: number;
  total: number;
}

export interface VendorOrdersResponse {
  orders: VendorOrderListItem[];
  count: number;
  page: number;
  limit: number;
  offset: number;
}
