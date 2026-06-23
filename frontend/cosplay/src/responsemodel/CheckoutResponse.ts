export interface CheckoutResponse {
  orderId: number;
  totalAmount: number;
  status: string;
  paymentUrl: string; // Trả về link VNPay (nếu có), rỗng nếu là COD
}
