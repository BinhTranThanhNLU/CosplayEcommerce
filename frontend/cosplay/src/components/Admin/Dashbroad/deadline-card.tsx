import { Clock } from "lucide-react"

type DeadlineCardProps = {
  name: string
  item: string
  time: string
  urgency: "high" | "medium" | "low"
  id: string
}

export default function DeadlineCard({
  name,
  item,
  time,
  urgency,
  id,
}: DeadlineCardProps) {
  const urgencyColor = {
    high: "bg-rose-500 animate-pulse",
    medium: "bg-amber-500",
    low: "bg-emerald-500",
  }

  return (
    <div className="group flex items-center gap-4 rounded-2xl border border-slate-700/50 bg-slate-800/50 p-4 transition-all hover:bg-slate-800">
      {/* Thanh trạng thái */}
      <div className={`h-10 w-2 rounded-full ${urgencyColor[urgency]}`} />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between">
          <h5 className="truncate pr-2 text-sm font-bold transition-colors group-hover:text-indigo-400">
            {name}
          </h5>

          <span className="flex-shrink-0 text-[10px] font-bold text-slate-500 uppercase">
            {id}
          </span>
        </div>

        <p className="mb-1 truncate text-[11px] text-slate-400">{item}</p>

        <div className="flex items-center gap-1.5 text-[10px] font-black text-rose-400 uppercase">
          <Clock size={10} />
          {time}
        </div>
      </div>
    </div>
  )
}
