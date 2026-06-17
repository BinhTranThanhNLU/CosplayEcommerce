import { useState } from "react";
import {
  ShoppingCart,
  Clock,
  AlertCircle,
  MoreHorizontal,
} from "lucide-react";
import { orders } from "../../../data/orders.data";

// Stats
const stats = [
  { label: "Tổng đơn hàng", value: "1,248", icon: ShoppingCart },
  { label: "Đang xử lý", value: "42", icon: Clock },
  { label: "Quá hạn", value: "5", icon: AlertCircle },
];

const statusLabels: Record<string, string> = {
  Ongoing: "Đang thuê",
  Returned: "Đã trả",
  Processing: "Đang may",
  Overdue: "Quá hạn",
  Pending_Measurement: "Chờ số đo",
};

export default function OrderManagement() {
  const [filterType, setFilterType] = useState("all");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filteredOrders =
    filterType === "all"
      ? orders
      : orders.filter(
          (o) => o.type.toLowerCase() === filterType.toLowerCase()
        );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Quản lý Đơn hàng
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Theo dõi đơn thuê và đơn đặt may
        </p>
      </div>

      {/* STATS */}
      <div className="grid gap-5 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.label}</p>

                  <h3 className="mt-2 text-3xl font-bold text-slate-900">
                    {stat.value}
                  </h3>
                </div>

                <div className="rounded-xl bg-indigo-50 p-3">
                  <Icon className="text-indigo-600" size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FILTER */}
      <div className="flex items-center justify-between">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="rounded-xl border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">Tất cả</option>
          <option value="rent">Đơn thuê</option>
          <option value="tailor">Đơn đặt may</option>
        </select>

        <span className="text-sm text-slate-500">
          {filteredOrders.length} đơn hàng
        </span>
      </div>

      {/* ORDER LIST */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* LEFT */}
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-slate-300 px-3 py-1 text-xs">
                    {order.id}
                  </span>

                  <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
                    {order.type === "Rent" ? "Thuê" : "Đặt may"}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      order.status === "Ongoing" ||
                      order.status === "Processing"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Returned"
                        ? "bg-slate-100 text-slate-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {statusLabels[order.status]}
                  </span>
                </div>

                <div>
                  <p className="font-semibold text-slate-900">
                    {order.item}
                  </p>

                  <p className="text-sm text-slate-500">
                    Khách hàng: {order.customer}
                  </p>
                </div>

                {order.dateRange && (
                  <p className="text-sm text-slate-500">
                    Thời gian: {order.dateRange}
                  </p>
                )}

                {order.progress !== undefined && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">
                        Tiến độ may
                      </span>

                      <span className="font-medium">
                        {order.progress}%
                      </span>
                    </div>

                    <div className="h-2 rounded-full bg-slate-200">
                      <div
                        className="h-2 rounded-full bg-indigo-600"
                        style={{
                          width: `${order.progress}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-slate-500">
                    Tổng tiền
                  </p>

                  <p className="text-lg font-bold text-slate-900">
                    {order.amount}
                  </p>

                  <p className="text-xs text-slate-500">
                    {order.deadline}
                  </p>
                </div>

                {/* MENU */}
                <div className="relative">
                  <button
                    onClick={() =>
                      setOpenMenu(
                        openMenu === order.id
                          ? null
                          : order.id
                      )
                    }
                    className="rounded-lg p-2 hover:bg-slate-100"
                  >
                    <MoreHorizontal size={18} />
                  </button>

                  {openMenu === order.id && (
                    <div className="absolute right-0 z-20 mt-2 w-48 rounded-xl border border-slate-200 bg-white py-2 shadow-lg">
                      <button className="block w-full px-4 py-2 text-left text-sm hover:bg-slate-50">
                        Xem chi tiết
                      </button>

                      <button className="block w-full px-4 py-2 text-left text-sm hover:bg-slate-50">
                        Cập nhật trạng thái
                      </button>

                      <button className="block w-full px-4 py-2 text-left text-sm hover:bg-slate-50">
                        Liên hệ khách hàng
                      </button>

                      {order.status === "Overdue" && (
                        <button className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">
                          Xử lý quá hạn
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}