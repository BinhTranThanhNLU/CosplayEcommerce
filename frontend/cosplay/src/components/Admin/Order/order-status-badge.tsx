import { Clock, Package, Truck, CheckCircle2, XCircle } from "lucide-react";
import type { OrderStatus } from "../../../apis/orderApi";

type Props = { status: OrderStatus };

const CONFIG: Record<
    OrderStatus,
    { label: string; icon: React.ElementType; bg: string; text: string; border: string; pulse?: boolean }
> = {
    PENDING: {
        label: "Chờ xác nhận",
        icon: Clock,
        bg: "bg-amber-50",
        text: "text-amber-600",
        border: "border-amber-100",
    },
    PROCESSING: {
        label: "Đang xử lý",
        icon: Package,
        bg: "bg-blue-50",
        text: "text-blue-600",
        border: "border-blue-100",
        pulse: true,
    },
    SHIPPED: {
        label: "Đang giao",
        icon: Truck,
        bg: "bg-indigo-50",
        text: "text-indigo-600",
        border: "border-indigo-100",
    },
    COMPLETED: {
        label: "Hoàn thành",
        icon: CheckCircle2,
        bg: "bg-emerald-50",
        text: "text-emerald-600",
        border: "border-emerald-100",
    },
    CANCELLED: {
        label: "Đã hủy",
        icon: XCircle,
        bg: "bg-rose-50",
        text: "text-rose-500",
        border: "border-rose-100",
    },
};

export default function OrderStatusBadge({ status }: Props) {
    const cfg = CONFIG[status];
    if (!cfg) return <span className="text-xs text-slate-400">{status}</span>;
    const Icon = cfg.icon;
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[10px] font-black uppercase tracking-wide
                ${cfg.bg} ${cfg.text} ${cfg.border} ${cfg.pulse ? "animate-pulse" : ""}`}
        >
            <Icon size={10} />
            {cfg.label}
        </span>
    );
}
