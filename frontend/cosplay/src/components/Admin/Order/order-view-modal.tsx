import { X, MapPin, Store, User, Calendar } from "lucide-react";
import type { OrderDTO } from "../../../apis/orderApi";
import OrderStatusBadge from "./order-status-badge";

type Props = {
    order: OrderDTO;
    onClose: () => void;
};

const fmtVnd = (n: number) => n.toLocaleString("vi-VN") + "đ";
const fmtDate = (s: string) => new Date(s).toLocaleString("vi-VN");

export default function OrderViewModal({ order, onClose }: Props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="relative flex w-full max-w-2xl flex-col rounded-3xl bg-white shadow-2xl max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between border-b px-6 py-5">
                    <div>
                        <h2 className="text-lg font-black text-slate-900">
                            Chi tiết đơn hàng #{order.id}
                        </h2>
                        <p className="mt-0.5 text-xs text-slate-400">
                            Tạo lúc {fmtDate(order.createdAt)}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <OrderStatusBadge status={order.status} />
                        <button onClick={onClose} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100">
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Scrollable body */}
                <div className="overflow-y-auto px-6 py-5 space-y-5">

                    {/* Info grid */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <InfoCard icon={<User size={15} />} label="Khách hàng">
                            <p className="font-semibold text-slate-800">{order.customerName || "—"}</p>
                            <p className="text-xs text-slate-400">{order.customerEmail || "—"}</p>
                        </InfoCard>
                        <InfoCard icon={<Store size={15} />} label="Shop">
                            <p className="font-semibold text-slate-800">{order.shopName || "—"}</p>
                            <p className="text-xs text-slate-400">ID: {order.shopId}</p>
                        </InfoCard>
                        <InfoCard icon={<MapPin size={15} />} label="Địa chỉ giao hàng">
                            <p className="text-sm text-slate-700 leading-relaxed">{order.shippingAddress || "—"}</p>
                        </InfoCard>
                        <InfoCard icon={<Calendar size={15} />} label="Thời gian">
                            <p className="text-sm text-slate-700">{fmtDate(order.createdAt)}</p>
                        </InfoCard>
                    </div>

                    {/* Items */}
                    <div>
                        <h3 className="mb-3 text-xs font-black uppercase tracking-wider text-slate-400">
                            Sản phẩm ({order.items.length})
                        </h3>
                        <div className="space-y-2">
                            {order.items.length === 0 ? (
                                <p className="text-sm text-slate-400">Không có sản phẩm.</p>
                            ) : (
                                order.items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                                        {item.imageUrl ? (
                                            <img src={item.imageUrl} alt={item.productName}
                                                className="h-12 w-12 rounded-lg object-cover" />
                                        ) : (
                                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-200 text-slate-400 text-xs font-bold">
                                                IMG
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="truncate text-sm font-bold text-slate-800">
                                                {item.productName || "—"}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                {[item.size, item.color].filter(Boolean).join(" · ")} ·{" "}
                                                x{item.quantity}
                                                {item.rental && (
                                                    <span className="ml-1 rounded bg-blue-100 px-1 text-blue-600">
                                                        Thuê
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-slate-400">{fmtVnd(item.price)} / sp</p>
                                            <p className="text-sm font-black text-slate-900">{fmtVnd(item.lineTotal)}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between rounded-2xl bg-indigo-50 px-5 py-4">
                        <p className="text-sm font-bold text-slate-600">Tổng thanh toán</p>
                        <p className="text-2xl font-black text-indigo-700">{fmtVnd(order.totalAmount)}</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t px-6 py-4 text-center">
                    <button onClick={onClose}
                        className="rounded-xl bg-slate-100 px-6 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200 transition">
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}

function InfoCard({
    icon,
    label,
    children,
}: {
    icon: React.ReactNode;
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-xl bg-slate-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-slate-400">
                {icon}
                <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
            </div>
            {children}
        </div>
    );
}
