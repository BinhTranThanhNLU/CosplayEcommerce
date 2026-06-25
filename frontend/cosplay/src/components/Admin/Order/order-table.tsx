import type { OrderDTO } from "../../../apis/orderApi";
import OrderRow from "./order-row";

type Props = {
    orders: OrderDTO[];
    totalItems: number;
    loading: boolean;
    onView: (order: OrderDTO) => void;
    onChangeStatus: (order: OrderDTO) => void;
};

const COLS = [
    "Mã đơn", "Khách hàng", "Shop", "Trạng thái",
    "Tổng tiền", "Sản phẩm", "Ngày tạo", "Thao tác",
];

export default function OrderTable({ orders, totalItems, loading, onView, onChangeStatus }: Props) {
    return (
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 p-6">
                <p className="text-sm font-bold text-slate-900">Danh sách đơn hàng</p>
                <p className="text-xs text-slate-500">{totalItems.toLocaleString("vi-VN")} đơn</p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/60">
                            {COLS.map((c) => (
                                <th key={c} className="px-5 py-4 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                    {c}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td colSpan={8} className="py-16 text-center text-sm text-slate-400">
                                    Đang tải...
                                </td>
                            </tr>
                        ) : orders.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="py-16 text-center text-sm text-slate-400">
                                    Không tìm thấy đơn hàng nào.
                                </td>
                            </tr>
                        ) : (
                            orders.map((o) => (
                                <OrderRow
                                    key={o.id}
                                    order={o}
                                    onView={onView}
                                    onChangeStatus={onChangeStatus}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
