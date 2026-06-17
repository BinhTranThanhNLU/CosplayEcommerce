import { Eye, RefreshCw } from "lucide-react";
import type { OrderDTO } from "../../../apis/orderApi";
import OrderStatusBadge from "./order-status-badge";

type Props = {
    order: OrderDTO;
    onView: (order: OrderDTO) => void;
    onChangeStatus: (order: OrderDTO) => void;
};

const fmtVnd  = (n: number) => n.toLocaleString("vi-VN") + "đ";
const fmtDate = (s: string) => new Date(s).toLocaleDateString("vi-VN");

export default function OrderRow({ order, onView, onChangeStatus }: Props) {
    return (
        <tr className="group transition-colors hover:bg-slate-50">
            {/* ID */}
            <td className="px-5 py-4">
                <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-600">
                    #{order.id}
                </span>
            </td>

            {/* Customer */}
            <td className="px-5 py-4">
                <p className="text-sm font-bold text-slate-800">{order.customerName || "—"}</p>
                <p className="text-[11px] text-slate-400">{order.customerEmail || "—"}</p>
            </td>

            {/* Shop */}
            <td className="px-5 py-4 text-sm text-slate-600">{order.shopName || "—"}</td>

            {/* Status */}
            <td className="px-5 py-4">
                <OrderStatusBadge status={order.status} />
            </td>

            {/* Total */}
            <td className="px-5 py-4">
                <p className="text-sm font-black text-slate-900">{fmtVnd(order.totalAmount)}</p>
            </td>

            {/* Items count */}
            <td className="px-5 py-4 text-center text-sm font-medium text-slate-600">
                {order.items.length}
            </td>

            {/* Date */}
            <td className="px-5 py-4 text-xs text-slate-400">{fmtDate(order.createdAt)}</td>

            {/* Actions */}
            <td className="px-5 py-4 text-right">
                <div className="flex justify-end gap-1 opacity-0 transition group-hover:opacity-100">
                    <button
                        title="Xem chi tiết"
                        onClick={() => onView(order)}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"
                    >
                        <Eye size={15} />
                    </button>
                    <button
                        title="Cập nhật trạng thái"
                        onClick={() => onChangeStatus(order)}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                        <RefreshCw size={15} />
                    </button>
                </div>
            </td>
        </tr>
    );
}
