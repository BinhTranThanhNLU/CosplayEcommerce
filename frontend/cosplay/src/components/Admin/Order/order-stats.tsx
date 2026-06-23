import { ShoppingCart, Clock, Package, Truck, CheckCircle2, XCircle, DollarSign } from "lucide-react";
import type { OrderStatsResponse } from "../../../apis/orderApi";

type Props = {
    stats: OrderStatsResponse | null;
    loading: boolean;
};

export default function OrderStats({ stats, loading }: Props) {
    const fmt = (n?: number) =>
        loading ? "..." : (n ?? 0).toLocaleString("vi-VN");

    const fmtVnd = (n?: number) =>
        loading ? "..." : (n ?? 0).toLocaleString("vi-VN") + "đ";

    const items = [
        { label: "Tổng đơn",     value: fmt(stats?.totalOrders),      icon: ShoppingCart, bg: "bg-slate-50",   text: "text-slate-600"   },
        { label: "Chờ xác nhận", value: fmt(stats?.pendingOrders),     icon: Clock,        bg: "bg-amber-50",   text: "text-amber-600"   },
        { label: "Đang xử lý",   value: fmt(stats?.processingOrders),  icon: Package,      bg: "bg-blue-50",    text: "text-blue-600"    },
        { label: "Đang giao",    value: fmt(stats?.shippedOrders),     icon: Truck,        bg: "bg-indigo-50",  text: "text-indigo-600"  },
        { label: "Hoàn thành",   value: fmt(stats?.completedOrders),   icon: CheckCircle2, bg: "bg-emerald-50", text: "text-emerald-600" },
        { label: "Đã hủy",       value: fmt(stats?.cancelledOrders),   icon: XCircle,      bg: "bg-rose-50",    text: "text-rose-500"    },
        { label: "Doanh thu",    value: fmtVnd(stats?.totalRevenue),   icon: DollarSign,   bg: "bg-green-50",   text: "text-green-600"   },
    ];

    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
            {items.map((s) => (
                <div
                    key={s.label}
                    className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${s.bg} ${s.text}`}>
                        <s.icon size={18} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{s.label}</p>
                        <p className="text-xl font-black text-slate-900">{s.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
