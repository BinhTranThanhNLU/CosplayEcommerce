import type { ProductVariantModel } from "./ProductVariantModel";

export interface ProductModel {
  id: number;

  shopId: number;
  shopName: string;

  categoryId: number;
  categoryName: string;

  name: string;
  description: string;
  type: string;

  createdAt: string;
  imageUrl: string;

  variants: ProductVariantModel[];
}