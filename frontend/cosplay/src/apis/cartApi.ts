import axiosClient from "./axiosClient";

export interface CartItem {
  id: number;
  productVariantId: number;
  productId: number;
  productName: string;
  imageUrl: string;
  size: string;
  color: string;
  stock: number;
  quantity: number;
  price: number;
  lineTotal: number;
}

export interface CartResponse {
  id: number;
  items: CartItem[];
  totalQuantity: number;
  totalAmount: number;
}

export interface CheckoutResponse {
  orderId: number;
  totalAmount: number;
  status: string;
}

export const getCart = async (): Promise<CartResponse> => {
  const response = await axiosClient.get("/cart");
  return response.data;
};

export const getCartCount = async (): Promise<number> => {
  const response = await axiosClient.get("/cart/count");
  return response.data;
};

export const addToCart = async (productVariantId: number, quantity = 1): Promise<CartResponse> => {
  const response = await axiosClient.post("/cart/items", { productVariantId, quantity });
  window.dispatchEvent(new Event("cartchange"));
  return response.data;
};

export const updateCartItem = async (itemId: number, quantity: number): Promise<CartResponse> => {
  const response = await axiosClient.put(`/cart/items/${itemId}`, { quantity });
  window.dispatchEvent(new Event("cartchange"));
  return response.data;
};

export const removeCartItem = async (itemId: number): Promise<CartResponse> => {
  const response = await axiosClient.delete(`/cart/items/${itemId}`);
  window.dispatchEvent(new Event("cartchange"));
  return response.data;
};

export const checkoutCart = async (shippingAddress: string): Promise<CheckoutResponse> => {
  const response = await axiosClient.post("/cart/checkout", { shippingAddress });
  window.dispatchEvent(new Event("cartchange"));
  return response.data;
};
