import type { CheckoutResponse } from "../responsemodel/CheckoutResponse";
import axiosClient from "./axiosClient";

// ─── Types ────────────────────────────────────────────────────────────────────

export type OrderStatus =
    | "PENDING"
    | "PROCESSING"
    | "SHIPPED"
    | "COMPLETED"
    | "CANCELLED";

export interface OrderItemDTO {
    id: number;
    productVariantId: number;
    productName: string;
    imageUrl: string | null;
    size: string | null;
    color: string | null;
    quantity: number;
    price: number;
    lineTotal: number;
    rental: boolean;
}

export interface OrderDTO {
    id: number;
    userId: number;
    customerName: string | null;
    customerEmail: string | null;
    shopId: number;
    shopName: string | null;
    totalAmount: number;
    status: OrderStatus;
    shippingAddress: string;
    createdAt: string;
    items: OrderItemDTO[];
}

export interface OrderPageResponse {
    orders: OrderDTO[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
}

export interface OrderStatsResponse {
    totalOrders: number;
    pendingOrders: number;
    processingOrders: number;
    shippedOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    totalRevenue: number;
}

export interface OrderQueryParams {
    keyword?: string;
    status?: string;
    page?: number;
    size?: number;
}

// ─── API calls ────────────────────────────────────────────────────────────────

export const getOrders = async (params: OrderQueryParams = {}): Promise<OrderPageResponse> => {
    const response = await axiosClient.get("/admin/orders", { params });
    return response.data;
};

export const getOrderStats = async (): Promise<OrderStatsResponse> => {
    const response = await axiosClient.get("/admin/orders/stats");
    return response.data;
};

export const getOrderById = async (id: number): Promise<OrderDTO> => {
    const response = await axiosClient.get(`/admin/orders/${id}`);
    return response.data;
};

export const updateOrderStatus = async (id: number, status: string): Promise<OrderDTO> => {
    const response = await axiosClient.patch(`/admin/orders/${id}/status`, { status });
    return response.data;
};

export const checkoutCart = async (shippingAddress: string, paymentMethod: string): Promise<CheckoutResponse> => {
  const response = await axiosClient.post("/orders/checkout", { 
    shippingAddress,
    paymentMethod
  });
  
  window.dispatchEvent(new Event("cartchange"));
  return response.data;
}