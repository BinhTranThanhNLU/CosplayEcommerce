import { Clock, CheckCircle2, Scissors, AlertCircle, User } from "lucide-react"

type Props = {
  status:
    | "Ongoing"
    | "Returned"
    | "Processing"
    | "Overdue"
    | "Pending_Measurement"
}

export default function OrderStatusBadge({ status }: Props) {
  switch (status) {
    case "Ongoing":
      return (
        <span className="flex items-center gap-1 rounded-lg border bg-blue-50 px-2.5 py-1 text-[10px] font-black text-blue-600">
          <Clock size={10} /> Đang thuê
        </span>
      )

    case "Returned":
      return (
        <span className="flex items-center gap-1 rounded-lg border bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-600">
          <CheckCircle2 size={10} /> Đã trả
        </span>
      )

    case "Processing":
      return (
        <span className="flex items-center gap-1 rounded-lg border bg-amber-50 px-2.5 py-1 text-[10px] font-black text-amber-600">
          <Scissors size={10} /> Đang may
        </span>
      )

    case "Overdue":
      return (
        <span className="flex animate-pulse items-center gap-1 rounded-lg border bg-rose-50 px-2.5 py-1 text-[10px] font-black text-rose-600">
          <AlertCircle size={10} /> Quá hạn
        </span>
      )

    case "Pending_Measurement":
      return (
        <span className="flex items-center gap-1 rounded-lg border bg-purple-50 px-2.5 py-1 text-[10px] font-black text-purple-600">
          <User size={10} /> Chờ số đo
        </span>
      )

    default:
      return null
  }
}
