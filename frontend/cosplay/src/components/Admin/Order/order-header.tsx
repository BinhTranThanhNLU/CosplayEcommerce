import { ShoppingCart } from "lucide-react";

export default function OrderHeader() {
    return (
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
                <h1 className="flex items-center gap-3 text-2xl font-black text-slate-900">
                    <ShoppingCart className="text-indigo-600" size={26} />
                    Quản lý Đơn hàng
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Theo dõi và cập nhật trạng thái đơn hàng của khách
                </p>
            </div>
        </div>
    );
}
