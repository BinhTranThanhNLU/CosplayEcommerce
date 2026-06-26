import { useState, useEffect, useMemo } from "react"
import { Link } from "react-router-dom"
import {
  Package,
  Search,
  Filter,
  Download,
  Eye,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  PackageCheck,
} from "lucide-react"

type OrderItem = {
  id: string
  name: string
  quantity: number
  price: number
  image?: string
}

type Order = {
  id: string
  date: string
  total: number
  status: "pending" | "processing" | "shipping" | "completed" | "cancelled"
  items: OrderItem[]
  shippingAddress?: string
  trackingNumber?: string
}

const STORAGE_KEY = "orders"

const SAMPLE_ORDERS: Order[] = [
  {
    id: "ORD-2024-001",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    total: 1299000,
    status: "completed",
    items: [
      {
        id: "P1",
        name: "Genshin Impact – Raiden Shogun",
        quantity: 1,
        price: 1299000,
      },
    ],
    shippingAddress: "123 Đường ABC, Quận 1, TP.HCM",
    trackingNumber: "VN123456789",
  },
  {
    id: "ORD-2024-002",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    total: 899000,
    status: "shipping",
    items: [
      {
        id: "P2",
        name: "Spy x Family – Anya Forger",
        quantity: 1,
        price: 899000,
      },
    ],
    shippingAddress: "456 Đường XYZ, Quận 3, TP.HCM",
    trackingNumber: "VN987654321",
  },
  {
    id: "ORD-2024-003",
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    total: 1599000,
    status: "processing",
    items: [
      {
        id: "P3",
        name: "Demon Slayer – Nezuko Kamado",
        quantity: 1,
        price: 1599000,
      },
    ],
    shippingAddress: "789 Đường DEF, Quận 7, TP.HCM",
  },
]

const statusConfig = {
  pending: {
    label: "Chờ xác nhận",
    icon: Clock,
    color: "text-muted-foreground",
  },
  processing: {
    label: "Đang xử lý",
    icon: Package,
    color: "text-blue-600",
  },
  shipping: {
    label: "Đang giao",
    icon: Truck,
    color: "text-amber-600",
  },
  completed: {
    label: "Hoàn thành",
    icon: CheckCircle2,
    color: "text-green-600",
  },
  cancelled: {
    label: "Đã hủy",
    icon: XCircle,
    color: "text-destructive",
  },
}

const STATUS_FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "pending", label: "Chờ xác nhận" },
  { value: "processing", label: "Đang xử lý" },
  { value: "shipping", label: "Đang giao" },
  { value: "completed", label: "Hoàn thành" },
  { value: "cancelled", label: "Đã hủy" },
]

const loadOrders = (): Order[] => {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch (e) {
      console.error("Failed to load orders:", e)
    }
  }
  return []
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount)

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })

const btnPrimary =
  "inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
const btnOutline =
  "inline-flex items-center justify-center rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium transition hover:bg-muted"
const inputClass =
  "h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
const selectClass =
  "h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring sm:w-[200px]"
const cardClass = "rounded-xl border border-gray-200 bg-white shadow-sm"
const badgeClass =
  "inline-flex w-fit items-center gap-1.5 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium"

function StatusBadge({ status }: { status: Order["status"] }) {
  const config = statusConfig[status]
  const StatusIcon = config.icon
  return (
    <span className={badgeClass}>
      <StatusIcon className={`h-3.5 w-3.5 ${config.color}`} />
      <span className={config.color}>{config.label}</span>
    </span>
  )
}

export function ProfileOrders() {
  const [orders, setOrders] = useState<Order[]>(loadOrders)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
    }
  }, [orders])

  const filteredOrders = useMemo(() => {
    let filtered = orders

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(query) ||
          order.items.some((item) =>
            item.name.toLowerCase().includes(query)
          )
      )
    }

    return filtered
  }, [orders, statusFilter, searchQuery])

  const handleImportSample = () => {
    setOrders((prev) => [...SAMPLE_ORDERS, ...prev])
  }

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsDetailOpen(true)
  }

  const closeDetail = () => {
    setIsDetailOpen(false)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="border-b border-border/60 bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-5 md:px-6">
          <nav className="mb-3 text-sm text-gray-500">
            <Link to="/">Trang chủ</Link>
            <span className="mx-2">/</span>
            <Link to="/profile">Thông tin cá nhân</Link>
            <span className="mx-2">/</span>
            <span>Lịch sử đơn hàng</span>
          </nav>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">
                Lịch sử đơn hàng
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Theo dõi và quản lý các đơn hàng của bạn
              </p>
            </div>
            {orders.length === 0 && (
              <button
                type="button"
                className={btnOutline}
                onClick={handleImportSample}
              >
                <Download className="mr-2 h-4 w-4" />
                Nhập đơn mẫu
              </button>
            )}
          </div>
        </div>
      </div>

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
          {orders.length === 0 ? (
            <div className={cardClass}>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="mb-4 h-12 w-12 text-muted-foreground/30" />
                <h3 className="text-lg font-semibold">Chưa có đơn hàng nào</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Các đơn hàng của bạn sẽ xuất hiện ở đây
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <Link to="/products" className={btnPrimary}>
                    Khám phá sản phẩm
                  </Link>
                  <button
                    type="button"
                    className={btnOutline}
                    onClick={handleImportSample}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Nhập đơn mẫu
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className={`mb-6 ${cardClass}`}>
                <div className="p-4">
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="relative flex-1">
                      <Search
                        className="absolute top-3 left-3 h-4 w-4 text-muted-foreground"
                      />
                      <input
                        type="search"
                        placeholder="Tìm theo mã đơn hoặc tên sản phẩm..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`pl-10 ${inputClass}`}
                      />
                    </div>
                    <div className="flex items-center gap-2 sm:w-[200px]">
                      <Filter className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className={selectClass}
                      >
                        {STATUS_FILTER_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className={cardClass}>
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Search className="mb-4 h-12 w-12 text-muted-foreground/30" />
                    <h3 className="text-lg font-semibold">
                      Không tìm thấy đơn hàng
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => {
                    const config = statusConfig[order.status]
                    const StatusIcon = config.icon
                    return (
                      <div
                        key={order.id}
                        className={`${cardClass} transition-all hover:border-primary/50 hover:shadow-md`}
                      >
                        <div className="border-b p-5 pb-3">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                                <PackageCheck className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h3 className="text-base font-semibold">
                                  {order.id}
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                  {formatDate(order.date)}
                                </p>
                              </div>
                            </div>
                            <span className={badgeClass}>
                              <StatusIcon
                                className={`h-3.5 w-3.5 ${config.color}`}
                              />
                              <span className={config.color}>
                                {config.label}
                              </span>
                            </span>
                          </div>
                        </div>
                        <div className="space-y-4 p-5">
                          <hr className="border-border/60" />
                          <div className="space-y-2">
                            {order.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between text-sm"
                              >
                                <div className="flex-1">
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    Số lượng: {item.quantity}
                                  </p>
                                </div>
                                <p className="font-semibold">
                                  {formatCurrency(item.price)}
                                </p>
                              </div>
                            ))}
                          </div>
                          <hr className="border-border/60" />
                          <div className="flex items-center justify-between">
                            <div className="text-sm">
                              <span className="text-muted-foreground">
                                Tổng cộng:
                              </span>
                              <span className="ml-2 text-lg font-bold text-primary">
                                {formatCurrency(order.total)}
                              </span>
                            </div>
                            <button
                              type="button"
                              className={btnOutline}
                              onClick={() => handleViewDetails(order)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Chi tiết
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {isDetailOpen && selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={closeDetail}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b px-6 py-4">
              <h2 className="text-lg font-semibold">Chi tiết đơn hàng</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Thông tin chi tiết về đơn hàng của bạn
              </p>
            </div>
            <div className="space-y-4 px-6 py-4">
              <div className="rounded-lg bg-muted/50 p-4">
                <div className="grid gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mã đơn hàng:</span>
                    <span className="font-semibold">{selectedOrder.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ngày đặt:</span>
                    <span className="font-medium">
                      {formatDate(selectedOrder.date)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Trạng thái:</span>
                    <StatusBadge status={selectedOrder.status} />
                  </div>
                  {selectedOrder.trackingNumber && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mã vận đơn:</span>
                      <span className="font-medium">
                        {selectedOrder.trackingNumber}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="mb-3 font-semibold">Sản phẩm</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg border border-border/60 p-3"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Số lượng: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {selectedOrder.shippingAddress && (
                <div>
                  <h4 className="mb-2 font-semibold">Địa chỉ giao hàng</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrder.shippingAddress}
                  </p>
                </div>
              )}

              <hr className="border-border/60" />

              <div className="flex items-center justify-between rounded-lg bg-primary/5 p-4">
                <span className="font-semibold">Tổng cộng:</span>
                <span className="text-xl font-bold text-primary">
                  {formatCurrency(selectedOrder.total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
