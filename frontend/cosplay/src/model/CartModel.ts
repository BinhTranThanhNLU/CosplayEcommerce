
import type { ProductModel } from './ProductModel';

export interface CartItem {
  product: ProductModel;
  quantity: number;
  size?: string;
}