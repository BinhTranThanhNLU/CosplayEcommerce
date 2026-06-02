import type { ProductModel } from "../model/ProductModel";

export type Product = ProductModel & {
  price?: number;
  rentPrice?: number;
  originalPrice?: number;
  canRent?: boolean;
  sizes?: string[];
  images?: string[];
  series?: string;
  badge?: string;
  rating?: number;
  reviewCount?: number;
  details?: Array<{ label: string; value: string }>;
};
