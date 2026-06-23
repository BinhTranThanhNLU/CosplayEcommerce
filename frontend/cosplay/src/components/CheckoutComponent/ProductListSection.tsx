import { PackageCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPrice } from "../../components/utils/Format";

interface ProductListSectionProps {
  selectedItems: any[];
}

export const ProductListSection = ({
  selectedItems,
}: ProductListSectionProps) => {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3 border-b border-dashed border-[#eee] pb-4">
        <PackageCheck className="h-6 w-6 text-[#ee4d2d]" />
        <h2 className="text-lg font-bold text-[#222]">Sản phẩm đặt mua</h2>
      </div>

      {selectedItems.length === 0 ? (
        <div className="rounded-xl bg-[#fff7f5] p-6 text-center text-sm text-[#ee4d2d]">
          Không có sản phẩm nào để thanh toán.
        </div>
      ) : (
        <div className="space-y-4">
          {selectedItems.map((item) => (
            <div
              key={item.id}
              className="grid gap-4 rounded-xl border border-[#f0f0f0] p-4 md:grid-cols-[88px_1fr_140px] md:items-center"
            >
              <img
                src={item.imageUrl}
                alt={item.productName}
                className="h-24 w-24 rounded-xl border border-[#eee] object-cover"
              />
              <div className="min-w-0">
                <Link
                  to={`/products/${item.productId}`}
                  className="line-clamp-2 font-semibold text-[#222] hover:text-[#ee4d2d]"
                >
                  {item.productName}
                </Link>
                <p className="mt-2 text-sm text-[#777]">
                  Phân loại: {item.size || "N/A"} / {item.color || "N/A"}
                </p>
                <p className="mt-1 text-sm text-[#777]">
                  Số lượng: x{item.quantity}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-[#777]">Thành tiền</p>
                <p className="mt-1 text-lg font-bold text-[#ee4d2d]">
                  {formatPrice(item.lineTotal)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
