import { CreditCard } from "lucide-react";

interface PaymentMethodSectionProps {
  paymentMethod: string;
  setPaymentMethod: (val: string) => void;
}

export const PaymentMethodSection = ({
  paymentMethod,
  setPaymentMethod,
}: PaymentMethodSectionProps) => {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3 border-b border-dashed border-[#eee] pb-4">
        <CreditCard className="h-6 w-6 text-[#ee4d2d]" />
        <h2 className="text-lg font-bold text-[#222]">
          Phương thức thanh toán
        </h2>
      </div>

      <div className="space-y-3">
        <label
          className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 ${paymentMethod === "COD" ? "border-[#ee4d2d] bg-[#fff7f5]" : "border-[#eee]"}`}
        >
          <span>
            <span className="block font-semibold text-[#222]">
              Thanh toán khi nhận hàng
            </span>
            <span className="text-sm text-[#777]">
              COD - phù hợp khi mua/thuê cosplay.
            </span>
          </span>
          <input
            type="radio"
            checked={paymentMethod === "COD"}
            onChange={() => setPaymentMethod("COD")}
            className="h-5 w-5 accent-[#ee4d2d]"
          />
        </label>

        <label
          className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 ${paymentMethod === "VNPAY" ? "border-[#ee4d2d] bg-[#fff7f5]" : "border-[#eee]"}`}
        >
          <span>
            <span className="block font-semibold text-[#222]">VNPAY</span>
            <span className="text-sm text-[#777]">
              Shop xác nhận sau khi nhận thanh toán.
            </span>
          </span>
          <input
            type="radio"
            checked={paymentMethod === "VNPAY"}
            onChange={() => setPaymentMethod("VNPAY")}
            className="h-5 w-5 accent-[#ee4d2d]"
          />
        </label>
      </div>
    </section>
  );
};
