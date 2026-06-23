import type { CheckoutResponse } from "../responsemodel/CheckoutResponse";
import axiosClient from "./axiosClient";

export const checkoutCart = async (shippingAddress: string, paymentMethod: string): Promise<CheckoutResponse> => {
  const response = await axiosClient.post("/orders/checkout", { 
    shippingAddress,
    paymentMethod
  });
  
  window.dispatchEvent(new Event("cartchange"));
  return response.data;
};
