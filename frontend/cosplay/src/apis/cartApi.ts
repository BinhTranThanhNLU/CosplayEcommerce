import type { CartResponse } from "../responsemodel/CartReponse";
import axiosClient from "./axiosClient";


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

