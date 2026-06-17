import {
  RotateCcw,
  Scissors,
  User,
  Calendar,
  Clock,
  Eye,
  MoreHorizontal,
} from "lucide-react"
import OrderStatusBadge from "../Order/order-status-badge"

type Order = {
  id: string
  customer: string
  type: "Rent" | "Tailor"
  item: string
  amount: string
  status:
    | "Ongoing"
    | "Returned"
    | "Processing"
    | "Overdue"
    | "Pending_Measurement"
  dateRange?: string
  progress?: number
  deadline: string
}

type Props = {
  order: Order
}

export default function OrderCard({ order }: Props) {
  return (
    <div className="rounded-[1.5rem] border bg-white p-5 transition hover:shadow-xl">
      <div className="flex flex-col justify-between gap-6 md:flex-row">
        {/* LEFT */}
        <div className="flex min-w-[300px] gap-4">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
              order.type === "Rent"
                ? "bg-blue-50 text-blue-600"
                : "bg-amber-50 text-amber-600"
            }`}
          >
            {order.type === "Rent" ? (
              <RotateCcw size={28} />
            ) : (
              <Scissors size={28} />
            )}
          </div>

          <div>
            <span className="text-[10px] font-black text-slate-400">
              {order.id}
            </span>

            <h3 className="font-black">{order.item}</h3>

            <p className="flex items-center gap-1 text-sm text-slate-500">
              <User size={14} /> {order.customer}
            </p>
          </div>
        </div>

        {/* MID */}
        <div className="max-w-md flex-1">
          <div className="mb-2 flex justify-between">
            <OrderStatusBadge status={order.status} />

            <span className="flex items-center gap-1 text-xs">
              <Calendar size={12} />
              {order.deadline}
            </span>
          </div>

          {order.type === "Tailor" ? (
            <div>
              <div className="flex justify-between text-[10px]">
                <span>Tiến độ</span>
                <span>{order.progress ?? 0}%</span>
              </div>

              <div className="h-1.5 rounded-full bg-slate-100">
                <div
                  className="h-full bg-indigo-500"
                  style={{ width: `${order.progress ?? 0}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs">
              <Clock size={14} />
              {order.dateRange}
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-slate-400">Tổng</p>
            <p className="font-black">{order.amount}</p>
          </div>

          <button className="rounded-xl p-2 hover:bg-slate-100">
            <Eye size={18} />
          </button>

          <button className="rounded-xl p-2 hover:bg-slate-100">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
