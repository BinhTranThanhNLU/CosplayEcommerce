import type { ProductModel } from "../model/ProductModel";

export interface ProductPageResponse {
  products: ProductModel[];

  currentPage: number;
  totalPages: number;
  totalItems: number;
}