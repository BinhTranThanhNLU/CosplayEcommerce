import { ShieldCheck } from "lucide-react";
import { formatPrice } from "../../components/utils/Format";

interface OrderSummarySectionProps {
  subtotal: number;
  shippingFee: number;
  finalTotal: number;
  isCheckingOut: boolean;
  isCartEmpty: boolean;
}

export const OrderSummarySection = ({
  subtotal,
  shippingFee,
  finalTotal,
  isCheckingOut,
  isCartEmpty,
}: OrderSummarySectionProps) => {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-bold text-[#222]">Tóm tắt thanh toán</h2>
      <div className="space-y-3 text-sm text-[#555]">
        <div className="flex justify-between">
          <span>Tạm tính</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Phí vận chuyển</span>
          <span>{formatPrice(shippingFee)}</span>
        </div>
      </div>
      <div className="my-5 border-t border-dashed border-[#ddd]" />
      <div className="flex items-end justify-between">
        <span className="font-semibold text-[#222]">Tổng thanh toán</span>
        <span className="text-3xl font-bold text-[#ee4d2d]">
          {formatPrice(finalTotal)}
        </span>
      </div>
      <button
        disabled={isCheckingOut || isCartEmpty}
        className="mt-6 w-full rounded-xl bg-[#ee4d2d] px-6 py-4 text-base font-bold text-white shadow-lg shadow-[#ee4d2d]/20 hover:bg-[#d73211] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isCheckingOut ? "Đang đặt hàng..." : "Đặt hàng"}
      </button>
      <div className="mt-4 flex items-center gap-2 text-xs text-[#777]">
        <ShieldCheck className="h-4 w-4 text-emerald-500" />
        Thông tin đơn hàng được bảo mật và chỉ dùng để giao hàng.
      </div>
    </section>
  );
};
