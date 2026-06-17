import { Users } from "lucide-react"

type ProgressItemProps = {
  order: string
  character: string
  client: string
  progress: number
  step: string
  dueDate: string
  isDelayed?: boolean // optional
}

export default function ProgressItem({
  order,
  character,
  client,
  progress,
  step,
  dueDate,
  isDelayed = false,
}: ProgressItemProps) {
  return (
    <div className="group transition-all">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="rounded bg-indigo-50 px-2 py-0.5 text-[11px] font-black tracking-tighter text-indigo-600 uppercase">
              {order}
            </span>

            <h4 className="text-sm font-bold text-slate-800 transition-colors group-hover:text-indigo-600">
              {character}
            </h4>
          </div>

          <p className="flex items-center gap-1.5 text-xs font-medium tracking-tight text-slate-400">
            <Users size={12} />
            Khách hàng:
            <span className="font-bold text-slate-600 underline decoration-slate-200">
              {client}
            </span>
          </p>
        </div>

        <div className="text-right">
          <span
            className={`rounded-md px-2 py-1 text-[10px] font-black uppercase ${
              isDelayed
                ? "border border-rose-100 bg-rose-50 text-rose-600"
                : "border border-slate-100 bg-slate-50 text-slate-500"
            }`}
          >
            {dueDate}
          </span>

          <p className="mt-1 text-[11px] font-bold text-slate-400">{step}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative pt-1">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-bold text-indigo-600 uppercase">
            Tiến độ xưởng
          </span>

          <span className="text-xs font-black text-indigo-600">
            {progress}%
          </span>
        </div>

        <div className="h-2.5 overflow-hidden rounded-full border border-slate-50 bg-slate-100">
          <div
            style={{ width: `${progress}%` }}
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-1000 ease-out"
          />
        </div>
      </div>
    </div>
  )
}
