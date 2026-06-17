import { ShoppingCart, FileText } from "lucide-react"

export default function OrderHeader() {
  return (
    <div className="flex flex-col justify-between gap-4 lg:flex-row">
      <div>
        <h1 className="flex items-center gap-3 text-2xl font-black">
          <ShoppingCart className="text-indigo-600" />
          Quản lý Đơn hàng
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Theo dõi đơn thuê & đơn may
        </p>
      </div>

      <div className="flex gap-3">
        <button className="rounded-xl border bg-white px-4 py-2.5">
          <FileText size={16} /> Xuất báo cáo
        </button>

        <button className="rounded-xl bg-indigo-600 px-5 py-2.5 text-white">
          + Tạo đơn mới
        </button>
      </div>
    </div>
  )
}
