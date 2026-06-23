import { useState } from "react";
import { X, Loader2, ArrowRight } from "lucide-react";
import type { OrderDTO, OrderStatus } from "../../../apis/orderApi";
import { updateOrderStatus } from "../../../apis/orderApi";
import OrderStatusBadge from "./order-status-badge";

type Props = {
    order: OrderDTO;
    onClose: () => void;
    onUpdated: (updated: OrderDTO) => void;
};

// Luồng chuyển trạng thái hợp lệ
const NEXT_STATUSES: Record<OrderStatus, OrderStatus[]> = {
    PENDING:    ["PROCESSING", "CANCELLED"],
    PROCESSING: ["SHIPPED",    "CANCELLED"],
    SHIPPED:    ["COMPLETED",  "CANCELLED"],
    COMPLETED:  [],
    CANCELLED:  [],
};

const STATUS_LABEL: Record<OrderStatus, string> = {
    PENDING:    "Chờ xác nhận",
    PROCESSING: "Đang xử lý",
    SHIPPED:    "Đang giao",
    COMPLETED:  "Hoàn thành",
    CANCELLED:  "Đã hủy",
};

export default function OrderStatusModal({ order, onClose, onUpdated }: Props) {
    const [selected, setSelected] = useState<OrderStatus | "">("");
    const [saving,   setSaving]   = useState(false);
    const [error,    setError]    = useState("");

    const nextOptions = NEXT_STATUSES[order.status] ?? [];
    const canUpdate   = nextOptions.length > 0;

    const handleSave = async () => {
        if (!selected) { setError("Vui lòng chọn trạng thái mới."); return; }
        setSaving(true);
        setError("");
        try {
            const updated = await updateOrderStatus(order.id, selected);
            onUpdated(updated);
        } catch (err: unknown) {
            const msg =
                (err as { response?: { data?: { message?: string } } })
                    ?.response?.data?.message ?? "Cập nhật thất bại. Vui lòng thử lại.";
            setError(msg);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="relative w-full max-w-sm rounded-3xl bg-white shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between border-b px-6 py-5">
                    <h2 className="text-base font-black text-slate-900">Cập nhật trạng thái</h2>
                    <button onClick={onClose} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100">
                        <X size={18} />
                    </button>
                </div>

                <div className="px-6 py-5 space-y-4">
                    {/* Current */}
                    <div>
                        <p className="mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Trạng thái hiện tại</p>
                        <OrderStatusBadge status={order.status} />
                    </div>

                    {canUpdate ? (
                        <div>
                            <p className="mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Chuyển sang
                            </p>
                            <div className="space-y-2">
                                {nextOptions.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => { setSelected(s); setError(""); }}
                                        className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-bold transition ${
                                            selected === s
                                                ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                                                : "border-slate-200 hover:bg-slate-50 text-slate-700"
                                        }`}
                                    >
                                        <span className="flex items-center gap-2">
                                            <ArrowRight size={14} className="text-slate-400" />
                                            {STATUS_LABEL[s]}
                                        </span>
                                        {selected === s && (
                                            <span className="h-2 w-2 rounded-full bg-indigo-600" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
                            Đơn hàng này đã ở trạng thái cuối, không thể thay đổi.
                        </p>
                    )}

                    {error && (
                        <p className="rounded-xl bg-rose-50 px-4 py-2.5 text-xs font-medium text-rose-600">{error}</p>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 border-t px-6 py-4">
                    <button onClick={onClose}
                        className="rounded-xl border border-slate-200 px-5 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 transition">
                        Hủy
                    </button>
                    {canUpdate && (
                        <button onClick={handleSave} disabled={saving || !selected}
                            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50 transition">
                            {saving && <Loader2 size={14} className="animate-spin" />}
                            Cập nhật
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
