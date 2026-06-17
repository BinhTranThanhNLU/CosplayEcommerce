import { ReactNode } from "react"

type StatCardProps = {
  label: string
  value: string
  change: string
  isPositive: boolean
  icon: ReactNode
  theme: "indigo" | "emerald" | "rose" | "amber"
}

export default function StatCard({
  label,
  value,
  change,
  isPositive,
  icon,
  theme,
}: StatCardProps) {
  const themes = {
    indigo: "bg-indigo-600 text-white shadow-indigo-100 border-indigo-500",
    emerald: "bg-white text-slate-900 shadow-slate-100 border-slate-100",
    rose: "bg-white text-slate-900 shadow-slate-100 border-slate-100",
    amber: "bg-white text-slate-900 shadow-slate-100 border-slate-100",
  }

  const iconColors = {
    indigo: "bg-white/20 text-white",
    emerald: "bg-emerald-50 text-emerald-600",
    rose: "bg-rose-50 text-rose-600",
    amber: "bg-amber-50 text-amber-600",
  }

  return (
    <div
      className={`rounded-[2rem] border p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl ${themes[theme]}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className={`rounded-2xl p-3 ${iconColors[theme]}`}>{icon}</div>

        <div
          className={`flex items-center text-xs font-black ${
            isPositive
              ? theme === "indigo"
                ? "text-indigo-200"
                : "text-emerald-500"
              : "text-rose-500"
          }`}
        >
          {isPositive ? "↑" : "↓"} {change}
        </div>
      </div>

      <h4
        className={`${theme === "indigo" ? "text-indigo-100" : "text-slate-500"} text-[13px] font-bold tracking-wider uppercase`}
      >
        {label}
      </h4>

      <p className="mt-1 text-3xl font-black tracking-tight">{value}</p>
    </div>
  )
}
