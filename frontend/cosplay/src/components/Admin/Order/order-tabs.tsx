import { RotateCcw, Scissors } from "lucide-react"

type Props = {
  orderType: string
  setOrderType: (type: string) => void
}

export default function OrderTabs({ orderType, setOrderType }: Props) {
  const tabs = [
    { key: "All", label: "Tất cả đơn" },
    { key: "Rent", label: "Đơn thuê đồ", icon: RotateCcw },
    { key: "Tailor", label: "Đơn đặt may", icon: Scissors },
  ]

  return (
    <div className="flex gap-4 border-b border-slate-200">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setOrderType(tab.key)}
          className={`relative px-2 pb-4 text-sm font-bold ${
            orderType === tab.key ? "text-indigo-600" : "text-slate-400"
          }`}
        >
          <span className="flex items-center gap-2">
            {tab.icon && <tab.icon size={16} />}
            {tab.label}
          </span>

          {orderType === tab.key && (
            <div className="absolute bottom-0 left-0 h-1 w-full rounded-t-full bg-indigo-600" />
          )}
        </button>
      ))}
    </div>
  )
}
