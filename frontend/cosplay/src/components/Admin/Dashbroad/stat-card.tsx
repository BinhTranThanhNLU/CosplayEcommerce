import type { ElementType } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

type Props = {
    label:      string;
    value:      string;
    sub?:       string;
    icon:       ElementType;
    iconBg:     string;
    iconText:   string;
    trend?:     { value: string; positive: boolean };
    accent?:    boolean; // highlighted card (indigo bg)
};

export default function StatCard({ label, value, sub, icon: Icon, iconBg, iconText, trend, accent }: Props) {
    if (accent) {
        return (
            <div className="flex flex-col justify-between rounded-3xl bg-indigo-600 p-6 shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-xl">
                <div className="flex items-start justify-between">
                    <div className="rounded-2xl bg-white/20 p-3">
                        <Icon size={22} className="text-white" />
                    </div>
                    {trend && (
                        <span className={`flex items-center gap-1 text-xs font-black ${trend.positive ? "text-indigo-200" : "text-rose-300"}`}>
                            {trend.positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            {trend.value}
                        </span>
                    )}
                </div>
                <div className="mt-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-indigo-200">{label}</p>
                    <p className="mt-1 text-3xl font-black text-white">{value}</p>
                    {sub && <p className="mt-1 text-xs text-indigo-300">{sub}</p>}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col justify-between rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
                <div className={`rounded-2xl p-3 ${iconBg}`}>
                    <Icon size={22} className={iconText} />
                </div>
                {trend && (
                    <span className={`flex items-center gap-1 text-xs font-black ${trend.positive ? "text-emerald-500" : "text-rose-500"}`}>
                        {trend.positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {trend.value}
                    </span>
                )}
            </div>
            <div className="mt-4">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{label}</p>
                <p className="mt-1 text-3xl font-black text-slate-900">{value}</p>
                {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
            </div>
        </div>
    );
}
