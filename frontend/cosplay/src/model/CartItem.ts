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
  salePrice: number;
  rentPrice: number;
  depositFee: number;
  itemType: "SELL" | "RENT";
  rentalDays: number | null;
  lineTotal: number;
}