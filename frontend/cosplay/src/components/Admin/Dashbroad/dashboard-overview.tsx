import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Users, ShoppingCart, DollarSign, TrendingUp,
    Clock, Package, Truck, CheckCircle2, XCircle,
    ArrowUpRight, Store, Ban, UserCheck,
} from "lucide-react";

import StatCard from "./stat-card";
import { getDashboardStats, type DashboardStatsResponse } from "../../../apis/dashboardApi";
import type { OrderDTO } from "../../../apis/orderApi";

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CFG: Record<string, { label: string; cls: string }> = {
    PENDING:    { label: "Chờ xác nhận", cls: "bg-amber-100 text-amber-700"   },
    PROCESSING: { label: "Đang xử lý",   cls: "bg-blue-100 text-blue-700"     },
    SHIPPED:    { label: "Đang giao",     cls: "bg-indigo-100 text-indigo-700" },
    COMPLETED:  { label: "Hoàn thành",   cls: "bg-emerald-100 text-emerald-700"},
    CANCELLED:  { label: "Đã hủy",       cls: "bg-rose-100 text-rose-600"     },
};

const fmtVnd = (n: number) => {
    if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + "B";
    if (n >= 1_000_000)     return (n / 1_000_000).toFixed(1) + "M";
    if (n >= 1_000)         return (n / 1_000).toFixed(0) + "K";
    return n.toLocaleString("vi-VN");
};

const fmtDate = (s: string) => new Date(s).toLocaleDateString("vi-VN");

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
    return <div className={`animate-pulse rounded-xl bg-slate-100 ${className}`} />;
}

// ─── Recent order row ─────────────────────────────────────────────────────────
function RecentOrderRow({ order }: { order: OrderDTO }) {
    const cfg = STATUS_CFG[order.status] ?? { label: order.status, cls: "bg-slate-100 text-slate-600" };
    return (
        <tr className="group border-t border-slate-100 transition hover:bg-slate-50">
            <td className="px-4 py-3">
                <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-black text-slate-600">
                    #{order.id}
                </span>
            </td>
            <td className="px-4 py-3">
                <p className="text-sm font-bold text-slate-800">{order.customerName || "—"}</p>
                <p className="text-[11px] text-slate-400">{order.customerEmail || "—"}</p>
            </td>
            <td className="px-4 py-3 text-sm text-slate-500">{order.shopName || "—"}</td>
            <td className="px-4 py-3">
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${cfg.cls}`}>
                    {cfg.label}
                </span>
            </td>
            <td className="px-4 py-3 text-right text-sm font-black text-slate-800">
                {order.totalAmount.toLocaleString("vi-VN")}đ
            </td>
            <td className="px-4 py-3 text-xs text-slate-400">{fmtDate(order.createdAt)}</td>
        </tr>
    );
}

// ─── Order status mini bar ────────────────────────────────────────────────────
function OrderStatusBar({ stats }: { stats: DashboardStatsResponse }) {
    const total = stats.totalOrders || 1;
    const bars = [
        { key: "pendingOrders",    label: "Chờ xác nhận", color: "bg-amber-400"   },
        { key: "processingOrders", label: "Xử lý",        color: "bg-blue-500"    },
        { key: "shippedOrders",    label: "Giao hàng",    color: "bg-indigo-500"  },
        { key: "completedOrders",  label: "Hoàn thành",   color: "bg-emerald-500" },
        { key: "cancelledOrders",  label: "Đã hủy",       color: "bg-rose-400"    },
    ] as const;

    return (
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-black text-slate-800">Phân bổ đơn hàng</h3>
            {/* Stacked bar */}
            <div className="flex h-3 overflow-hidden rounded-full">
                {bars.map((b) => {
                    const count = stats[b.key as keyof DashboardStatsResponse] as number;
                    const pct   = (count / total) * 100;
                    return pct > 0 ? (
                        <div key={b.key} className={`${b.color} transition-all`} style={{ width: `${pct}%` }} />
                    ) : null;
                })}
            </div>
            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-3">
                {bars.map((b) => {
                    const count = stats[b.key as keyof DashboardStatsResponse] as number;
                    return (
                        <div key={b.key} className="flex items-center gap-1.5">
                            <div className={`h-2.5 w-2.5 rounded-full ${b.color}`} />
                            <span className="text-xs text-slate-500">{b.label}</span>
                            <span className="text-xs font-black text-slate-800">{count}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ─── User breakdown ───────────────────────────────────────────────────────────
function UserBreakdown({ stats }: { stats: DashboardStatsResponse }) {
    const items = [
        { label: "Khách hàng", value: stats.totalCustomers, icon: UserCheck, color: "text-blue-600",   bg: "bg-blue-50"   },
        { label: "Seller",     value: stats.totalSellers,   icon: Store,     color: "text-amber-600",  bg: "bg-amber-50"  },
        { label: "Bị khóa",    value: stats.bannedUsers,    icon: Ban,       color: "text-rose-600",   bg: "bg-rose-50"   },
    ];
    return (
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-black text-slate-800">Phân loại người dùng</h3>
            <div className="space-y-3">
                {items.map((item) => {
                    const pct = stats.totalUsers > 0 ? Math.round((item.value / stats.totalUsers) * 100) : 0;
                    const Icon = item.icon;
                    return (
                        <div key={item.label}>
                            <div className="mb-1 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={`rounded-lg p-1.5 ${item.bg}`}>
                                        <Icon size={13} className={item.color} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-600">{item.label}</span>
                                </div>
                                <span className="text-xs font-black text-slate-800">
                                    {item.value.toLocaleString("vi-VN")} <span className="font-normal text-slate-400">({pct}%)</span>
                                </span>
                            </div>
                            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                                <div
                                    className={`h-full rounded-full transition-all ${item.bg.replace("bg-", "bg-").replace("-50", "-400")}`}
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function DashboardOverview() {
    const [stats,   setStats]   = useState<DashboardStatsResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDashboardStats()
            .then(setStats)
            .catch(() => {/* ignore — keep null */})
            .finally(() => setLoading(false));
    }, []);

    const today = new Date().toLocaleDateString("vi-VN", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
    });

    return (
        <div className="mx-auto max-w-[1600px] space-y-6">

            {/* ── Header ───────────────────────────────────────────────────── */}
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Tổng quan hệ thống</h1>
                    <p className="mt-1 text-sm capitalize text-slate-400">{today}</p>
                </div>
                <div className="flex gap-3">
                    <Link to="/admin/users"
                        className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition">
                        <Users size={14} /> Quản lý User
                    </Link>
                    <Link to="/admin/orders"
                        className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition">
                        <ShoppingCart size={14} /> Đơn hàng
                    </Link>
                </div>
            </div>

            {/* ── KPI Cards ────────────────────────────────────────────────── */}
            {loading ? (
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-36 rounded-3xl" />
                    ))}
                </div>
            ) : stats ? (
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <StatCard
                        accent
                        label="Doanh thu"
                        value={fmtVnd(stats.totalRevenue) + "đ"}
                        sub={`Hôm nay: ${fmtVnd(stats.revenueToday)}đ`}
                        icon={DollarSign}
                        iconBg="" iconText=""
                    />
                    <StatCard
                        label="Tổng người dùng"
                        value={stats.totalUsers.toLocaleString("vi-VN")}
                        sub={`+${stats.newUsersToday} hôm nay`}
                        icon={Users}
                        iconBg="bg-blue-50" iconText="text-blue-600"
                        trend={{ value: `${stats.newUsersToday} mới`, positive: true }}
                    />
                    <StatCard
                        label="Tổng đơn hàng"
                        value={stats.totalOrders.toLocaleString("vi-VN")}
                        sub={`${stats.pendingOrders} chờ xác nhận`}
                        icon={ShoppingCart}
                        iconBg="bg-indigo-50" iconText="text-indigo-600"
                    />
                    <StatCard
                        label="Hoàn thành"
                        value={stats.completedOrders.toLocaleString("vi-VN")}
                        sub={`${stats.cancelledOrders} đã hủy`}
                        icon={CheckCircle2}
                        iconBg="bg-emerald-50" iconText="text-emerald-600"
                        trend={{
                            value: stats.totalOrders > 0
                                ? Math.round((stats.completedOrders / stats.totalOrders) * 100) + "%"
                                : "0%",
                            positive: true,
                        }}
                    />
                </div>
            ) : null}

            {/* ── Order status breakdown + User breakdown ───────────────────── */}
            {loading ? (
                <div className="grid gap-4 lg:grid-cols-2">
                    <Skeleton className="h-44 rounded-3xl" />
                    <Skeleton className="h-44 rounded-3xl" />
                </div>
            ) : stats ? (
                <div className="grid gap-4 lg:grid-cols-2">
                    <OrderStatusBar stats={stats} />
                    <UserBreakdown  stats={stats} />
                </div>
            ) : null}

            {/* ── Order mini stats row ───────────────────────────────────────── */}
            {!loading && stats && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                    {[
                        { label: "Chờ xác nhận", value: stats.pendingOrders,    icon: Clock,        bg: "bg-amber-50",   text: "text-amber-600"   },
                        { label: "Đang xử lý",   value: stats.processingOrders, icon: Package,      bg: "bg-blue-50",    text: "text-blue-600"    },
                        { label: "Đang giao",    value: stats.shippedOrders,    icon: Truck,        bg: "bg-indigo-50",  text: "text-indigo-600"  },
                        { label: "Hoàn thành",   value: stats.completedOrders,  icon: CheckCircle2, bg: "bg-emerald-50", text: "text-emerald-600" },
                        { label: "Đã hủy",       value: stats.cancelledOrders,  icon: XCircle,      bg: "bg-rose-50",    text: "text-rose-500"    },
                    ].map((item) => {
                        const Icon = item.icon;
                        return (
                            <div key={item.label}
                                className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
                                <div className={`rounded-xl p-2 ${item.bg}`}>
                                    <Icon size={16} className={item.text} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{item.label}</p>
                                    <p className="text-lg font-black text-slate-900">{item.value}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── Recent orders ──────────────────────────────────────────────── */}
            <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                    <div className="flex items-center gap-2">
                        <TrendingUp size={18} className="text-indigo-600" />
                        <h3 className="text-sm font-black text-slate-900">Đơn hàng gần đây</h3>
                    </div>
                    <Link to="/admin/orders"
                        className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline">
                        Xem tất cả <ArrowUpRight size={13} />
                    </Link>
                </div>

                {loading ? (
                    <div className="space-y-3 p-6">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="h-10" />
                        ))}
                    </div>
                ) : !stats || stats.recentOrders.length === 0 ? (
                    <p className="py-12 text-center text-sm text-slate-400">Chưa có đơn hàng nào.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/60">
                                    {["Mã đơn", "Khách hàng", "Shop", "Trạng thái", "Tổng tiền", "Ngày tạo"].map((h) => (
                                        <th key={h} className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentOrders.map((o) => (
                                    <RecentOrderRow key={o.id} order={o} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
