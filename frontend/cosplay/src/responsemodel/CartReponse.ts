import type { CartItem } from "../model/CartItem";

export interface CartResponse {
  id: number;
  items: CartItem[];
  totalQuantity: number;
  totalAmount: number;
}