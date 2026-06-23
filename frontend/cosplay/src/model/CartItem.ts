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