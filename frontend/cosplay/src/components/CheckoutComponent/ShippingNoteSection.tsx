import { Truck } from "lucide-react";
import { formatPrice } from "../../components/utils/Format";

interface ShippingNoteSectionProps {
  note: string;
  setNote: (val: string) => void;
  shippingFee: number;
}

export const ShippingNoteSection = ({
  note,
  setNote,
  shippingFee,
}: ShippingNoteSectionProps) => {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3 border-b border-dashed border-[#eee] pb-4">
        <Truck className="h-6 w-6 text-[#ee4d2d]" />
        <h2 className="text-lg font-bold text-[#222]">Vận chuyển & ghi chú</h2>
      </div>
      <div className="rounded-xl border border-[#f0f0f0] bg-[#fffaf8] p-4 text-sm text-[#555]">
        <div className="flex items-center justify-between font-semibold text-[#222]">
          <span>Giao hàng tiêu chuẩn</span>
          <span>{formatPrice(shippingFee)}</span>
        </div>
        <p className="mt-2 text-[#777]">
          Dự kiến giao 2-5 ngày. Shop sẽ liên hệ xác nhận trước khi gửi hàng.
        </p>
      </div>
      <label className="mt-4 block space-y-2 text-sm font-medium text-[#333]">
        Ghi chú cho shop
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          className="w-full rounded-xl border border-[#e8e8e8] px-4 py-3 outline-none focus:border-[#ee4d2d]"
          placeholder="Ví dụ: giao giờ hành chính, kiểm tra size trước khi gửi..."
        />
      </label>
    </section>
  );
};
