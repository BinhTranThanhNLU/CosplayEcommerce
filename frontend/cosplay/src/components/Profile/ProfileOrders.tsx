import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Search,
  Filter,
  Eye,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  PackageCheck,
  X,
  ShoppingBag,
  CreditCard,
  MapPin,
  Tag,
  Banknote,
  Wallet,
} from "lucide-react";
import {
  getMyOrders,
  type OrderDTO,
  type OrderStatus,
  type PaymentStatus,
} from "../../apis/orderApi";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount,
  );

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

// ─── Status config (khớp với BE enum: PENDING | PROCESSING | SHIPPED | COMPLETED | CANCELLED) ──

const statusConfig: Record<
  OrderStatus,
  { label: string; icon: React.ElementType; color: string; bg: string }
> = {
  PENDING: {
    label: "Chờ xác nhận",
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-200",
  },
  PROCESSING: {
    label: "Đang xử lý",
    icon: Package,
    color: "text-blue-600",
    bg: "bg-blue-50 border-blue-200",
  },
  SHIPPED: {
    label: "Đang giao hàng",
    icon: Truck,
    color: "text-indigo-600",
    bg: "bg-indigo-50 border-indigo-200",
  },
  COMPLETED: {
    label: "Hoàn thành",
    icon: CheckCircle2,
    color: "text-green-600",
    bg: "bg-green-50 border-green-200",
  },
  CANCELLED: {
    label: "Đã hủy",
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-50 border-red-200",
  },
};

const STATUS_FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "PENDING", label: "Chờ xác nhận" },
  { value: "PROCESSING", label: "Đang xử lý" },
  { value: "SHIPPED", label: "Đang giao hàng" },
  { value: "COMPLETED", label: "Hoàn thành" },
  { value: "CANCELLED", label: "Đã hủy" },
];

// ─── Payment config ───────────────────────────────────────────────────────────

const paymentStatusConfig: Record<
  PaymentStatus,
  { label: string; color: string }
> = {
  UNPAID: { label: "Chưa thanh toán", color: "text-amber-600" },
  PAID: { label: "Đã thanh toán", color: "text-green-600" },
  FAILED: { label: "Thanh toán lỗi", color: "text-red-500" },
  REFUNDED: { label: "Đã hoàn tiền", color: "text-blue-600" },
};

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = statusConfig[status] ?? statusConfig.PENDING;
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.bg} ${cfg.color}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {cfg.label}
    </span>
  );
}

function OrderSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="animate-pulse rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center gap-3 border-b pb-4">
            <div className="h-10 w-10 rounded-xl bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 rounded bg-gray-200" />
              <div className="h-3 w-48 rounded bg-gray-200" />
            </div>
            <div className="h-6 w-24 rounded-full bg-gray-200" />
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-3/4 rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Order Detail Modal ───────────────────────────────────────────────────────

function OrderDetailModal({
  order,
  onClose,
}: {
  order: OrderDTO;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-lg font-bold">Chi tiết đơn hàng</h2>
            <p className="text-sm text-gray-500">#{order.id}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          {/* Thông tin tổng quát */}
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="grid gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Mã đơn hàng</span>
                <span className="font-semibold">#{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Ngày đặt</span>
                <span className="font-medium">
                  {formatDate(order.createdAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Trạng thái</span>
                <StatusBadge status={order.status} />
              </div>
              {order.shopName && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Cửa hàng</span>
                  <span className="font-medium">{order.shopName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Danh sách sản phẩm */}
          <div>
            <h4 className="mb-3 flex items-center gap-2 font-semibold">
              <ShoppingBag className="h-4 w-4 text-gray-500" />
              Sản phẩm ({order.items?.length ?? 0})
            </h4>
            <div className="space-y-3">
              {(order.items ?? []).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-xl border border-gray-100 p-3"
                >
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="h-14 w-14 rounded-lg object-cover shrink-0"
                    />
                  ) : (
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                      <Package className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium">{item.productName}</p>
                    <div className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-gray-500">
                      {item.size && <span>Size: {item.size}</span>}
                      {item.color && <span>Màu: {item.color}</span>}
                      {item.rental && (
                        <span className="text-indigo-600 font-medium">
                          Thuê
                        </span>
                      )}
                      <span>x{item.quantity}</span>
                    </div>
                  </div>
                  <p className="shrink-0 font-semibold text-sm">
                    {formatCurrency(item.lineTotal ?? 0)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Địa chỉ giao hàng */}
          {order.shippingAddress && (
            <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
              <div>
                <p className="font-medium text-gray-700">Địa chỉ giao hàng</p>
                <p className="mt-0.5 text-gray-500">{order.shippingAddress}</p>
              </div>
            </div>
          )}

          {/* Phương thức & trạng thái thanh toán */}
          {(order.paymentMethod || order.paymentStatus) && (
            <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm">
              {order.paymentMethod === "VNPAY" ? (
                <Wallet className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
              ) : (
                <Banknote className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
              )}
              <div className="flex-1">
                <p className="font-medium text-gray-700">Thanh toán</p>
                <div className="mt-1 flex items-center gap-3 text-xs">
                  {order.paymentMethod && (
                    <span className="font-medium text-gray-600">
                      {order.paymentMethod === "VNPAY"
                        ? "VNPay"
                        : "Tiền mặt (COD)"}
                    </span>
                  )}
                  {order.paymentStatus && (
                    <span
                      className={`font-semibold ${paymentStatusConfig[order.paymentStatus]?.color ?? "text-gray-500"}`}
                    >
                      {paymentStatusConfig[order.paymentStatus]?.label ??
                        order.paymentStatus}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tổng tiền */}
          <div className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50 px-5 py-4">
            <span className="flex items-center gap-2 font-semibold text-gray-700">
              <CreditCard className="h-4 w-4" />
              Tổng cộng
            </span>
            <span className="text-xl font-bold text-blue-600">
              {formatCurrency(order.totalAmount ?? 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const btnOutline =
  "inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50";
const inputClass =
  "h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100";
const selectClass =
  "h-10 rounded-md border border-gray-200 bg-white px-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100";
const cardClass = "rounded-xl border border-gray-200 bg-white shadow-sm";

export function ProfileOrders() {
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State quản lý tab
  const [activeTab, setActiveTab] = useState<"buy" | "rent">("buy");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<OrderDTO | null>(null);

  useEffect(() => {
    setLoading(true);
    getMyOrders()
      .then((data) => setOrders(data))
      .catch(() =>
        setError("Không thể tải danh sách đơn hàng. Vui lòng thử lại."),
      )
      .finally(() => setLoading(false));
  }, []);

  const filteredOrders = useMemo(() => {
    let result = orders;

    // Lọc theo Tab (Đơn Mua / Đơn Thuê)
    result = result.filter((o) => {
      // Check sản phẩm đầu tiên xem có phải là hàng thuê không (vì order ko mix mua & thuê)
      const isRentalOrder =
        o.items && o.items.length > 0 && o.items[0].rental === true;
      return activeTab === "rent" ? isRentalOrder : !isRentalOrder;
    });

    // Lọc theo Trạng Thái
    if (statusFilter !== "all") {
      result = result.filter((o) => o.status === statusFilter);
    }

    // Lọc theo Text (Mã đơn hoặc tên sản phẩm)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          String(o.id).includes(q) ||
          (o.shopName ?? "").toLowerCase().includes(q) ||
          (o.items ?? []).some((item) =>
            item.productName.toLowerCase().includes(q),
          ),
      );
    }

    return result;
  }, [orders, activeTab, statusFilter, searchQuery]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border/60 bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-5 md:px-6">
          <nav className="mb-3 text-sm text-gray-500">
            <Link to="/">Trang chủ</Link>
            <span className="mx-2">/</span>
            <Link to="/profile">Thông tin cá nhân</Link>
            <span className="mx-2">/</span>
            <span>Lịch sử đơn hàng</span>
          </nav>

          <h1 className="text-2xl font-extrabold tracking-tight">
            Lịch sử đơn hàng
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Theo dõi và quản lý các đơn hàng của bạn
          </p>
        </div>
      </div>

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
          {/* ─── TABS MUA / THUÊ ─── */}
          <div className="mb-6 flex space-x-1 rounded-xl bg-gray-100 p-1 w-full max-w-md mx-auto sm:mx-0">
            <button
              onClick={() => setActiveTab("buy")}
              className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200 ${
                activeTab === "buy"
                  ? "bg-white shadow text-blue-700"
                  : "text-gray-600 hover:bg-white/[0.5] hover:text-gray-900"
              }`}
            >
              🛒 Đơn Mua
            </button>
            <button
              onClick={() => setActiveTab("rent")}
              className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200 ${
                activeTab === "rent"
                  ? "bg-white shadow text-blue-700"
                  : "text-gray-600 hover:bg-white/[0.5] hover:text-gray-900"
              }`}
            >
              👗 Đơn Thuê
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Loading skeleton */}
          {loading && <OrderSkeleton />}

          {/* Empty state (Toàn bộ) */}
          {!loading && !error && orders.length === 0 && (
            <div className={cardClass}>
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                  <Package className="h-10 w-10 text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Chưa có đơn hàng nào
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Các đơn hàng sau khi đặt sẽ xuất hiện ở đây
                </p>
                <Link
                  to="/products"
                  className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Khám phá sản phẩm
                </Link>
              </div>
            </div>
          )}

          {/* Danh sách đơn hàng */}
          {!loading && !error && orders.length > 0 && (
            <>
              {/* Bộ lọc */}
              <div className={`mb-6 ${cardClass}`}>
                <div className="p-4">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                      <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                      <input
                        type="search"
                        placeholder="Tìm theo mã đơn hoặc tên sản phẩm..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`pl-10 ${inputClass}`}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 shrink-0 text-gray-400" />
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className={`${selectClass} w-full sm:w-[200px]`}
                      >
                        {STATUS_FILTER_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tổng hợp nhanh */}
              <div className="mb-4 text-sm text-gray-500">
                Hiển thị{" "}
                <span className="font-semibold text-gray-800">
                  {filteredOrders.length}
                </span>{" "}
                đơn hàng {activeTab === "buy" ? "Mua" : "Thuê"}
              </div>

              {/* Không tìm thấy */}
              {filteredOrders.length === 0 ? (
                <div className={cardClass}>
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Search className="mb-3 h-10 w-10 text-gray-300" />
                    <h3 className="font-semibold text-gray-700">
                      Chưa có đơn hàng {activeTab === "buy" ? "Mua" : "Thuê"}{" "}
                      nào
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => {
                    const cfg =
                      statusConfig[order.status] ?? statusConfig.PENDING;
                    const StatusIcon = cfg.icon;
                    const firstItem = order.items?.[0];
                    const extraCount = (order.items?.length ?? 0) - 1;

                    return (
                      <div
                        key={order.id}
                        className={`${cardClass} transition-all duration-150 hover:border-blue-200 hover:shadow-md`}
                      >
                        {/* Order header */}
                        <div className="flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                              <PackageCheck className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                Đơn hàng #{order.id}
                              </h3>
                              <p className="text-xs text-gray-500">
                                {formatDate(order.createdAt)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.bg} ${cfg.color}`}
                            >
                              <StatusIcon className="h-3.5 w-3.5" />
                              {cfg.label}
                            </span>
                          </div>
                        </div>

                        {/* Order body */}
                        <div className="space-y-4 px-5 py-4">
                          {/* Preview sản phẩm */}
                          <div className="flex items-center gap-3">
                            {firstItem?.imageUrl ? (
                              <img
                                src={firstItem.imageUrl}
                                alt={firstItem.productName}
                                className="h-12 w-12 rounded-lg object-cover border border-gray-100"
                              />
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                                <Package className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="truncate text-sm font-medium text-gray-800">
                                {firstItem?.productName ?? "(Không rõ)"}
                              </p>
                              {firstItem && (
                                <p className="text-xs text-gray-500">
                                  {[
                                    firstItem.size && `Size ${firstItem.size}`,
                                    firstItem.color,
                                    `x${firstItem.quantity}`,
                                  ]
                                    .filter(Boolean)
                                    .join(" · ")}
                                </p>
                              )}
                            </div>
                            {extraCount > 0 && (
                              <span className="shrink-0 flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                                <Tag className="h-3 w-3" />+{extraCount} sản
                                phẩm
                              </span>
                            )}
                          </div>

                          <hr className="border-gray-100" />

                          {/* Footer */}
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-sm text-gray-500">
                                Tổng cộng:{" "}
                              </span>
                              <span className="text-lg font-bold text-blue-600">
                                {formatCurrency(order.totalAmount ?? 0)}
                              </span>
                            </div>
                            <button
                              type="button"
                              className={btnOutline}
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Xem chi tiết
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
