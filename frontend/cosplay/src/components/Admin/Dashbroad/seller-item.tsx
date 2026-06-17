type SellerItemProps = {
  name: string
  sales: string
  growth: string
  avatar: string
}

export default function SellerItem({
  name,
  sales,
  growth,
  avatar,
}: SellerItemProps) {
  const isPositive = growth.startsWith("+")

  return (
    <div className="group flex cursor-pointer items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-sm font-black text-slate-600 transition-all group-hover:rotate-6 group-hover:bg-indigo-600 group-hover:text-white">
          {avatar}
        </div>

        <div>
          <p className="text-sm font-bold text-slate-800">{name}</p>
          <p className="text-xs font-medium text-slate-400">{sales}</p>
        </div>
      </div>

      <span
        className={`text-[11px] font-black ${
          isPositive ? "text-emerald-500" : "text-rose-500"
        }`}
      >
        {growth}
      </span>
    </div>
  )
}
