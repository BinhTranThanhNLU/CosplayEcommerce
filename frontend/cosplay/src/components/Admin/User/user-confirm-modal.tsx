import { AlertTriangle, ShieldCheck, Loader2 } from "lucide-react";

type Props = {
    title: string;
    message: string;
    confirmLabel?: string;
    confirmDanger?: boolean;
    loading?: boolean;
    error?: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export default function UserConfirmModal({
    title,
    message,
    confirmLabel = "Xác nhận",
    confirmDanger = false,
    loading = false,
    error = "",
    onConfirm,
    onCancel,
}: Props) {
    const Icon = confirmDanger ? AlertTriangle : ShieldCheck;
    const iconBg   = confirmDanger ? "bg-rose-100"   : "bg-amber-100";
    const iconText = confirmDanger ? "text-rose-600"  : "text-amber-600";
    const btnCls   = confirmDanger
        ? "bg-rose-600 hover:bg-rose-700"
        : "bg-indigo-600 hover:bg-indigo-700";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-sm rounded-3xl bg-white shadow-2xl">

                {/* Icon + text */}
                <div className="flex flex-col items-center gap-4 px-8 pt-8 pb-5 text-center">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${iconBg}`}>
                        <Icon size={26} className={iconText} />
                    </div>
                    <h2 className="text-base font-black text-slate-900">{title}</h2>
                    <p className="text-sm text-slate-500 leading-relaxed">{message}</p>
                </div>

                {/* Error message */}
                {error && (
                    <div className="mx-6 mb-4 rounded-xl bg-rose-50 px-4 py-2.5 text-xs font-medium text-rose-600">
                        {error}
                    </div>
                )}

                {/* Actions */}
                <div className="flex justify-center gap-3 border-t px-6 py-4">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="rounded-xl border border-slate-200 px-5 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-bold text-white disabled:opacity-60 transition ${btnCls}`}
                    >
                        {loading && <Loader2 size={14} className="animate-spin" />}
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
