import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
};

export default function OrderPagination({ currentPage, totalPages, totalItems, pageSize, onPageChange }: Props) {
    if (totalPages <= 1) return null;

    const from = currentPage * pageSize + 1;
    const to   = Math.min((currentPage + 1) * pageSize, totalItems);

    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
        for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
        pages.push(0);
        if (currentPage > 2) pages.push("...");
        for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages - 2, currentPage + 1); i++) pages.push(i);
        if (currentPage < totalPages - 3) pages.push("...");
        pages.push(totalPages - 1);
    }

    return (
        <div className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-400">
                Hiển thị {from}–{to} / {totalItems.toLocaleString("vi-VN")} đơn hàng
            </p>
            <div className="flex items-center gap-1">
                <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 0}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40 hover:bg-slate-50 transition">
                    <ChevronLeft size={16} />
                </button>
                {pages.map((p, i) =>
                    p === "..." ? (
                        <span key={`e${i}`} className="px-1 text-xs text-slate-400">…</span>
                    ) : (
                        <button key={p} onClick={() => onPageChange(p as number)}
                            className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition ${
                                currentPage === p
                                    ? "bg-indigo-600 text-white shadow"
                                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}>
                            {(p as number) + 1}
                        </button>
                    )
                )}
                <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages - 1}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40 hover:bg-slate-50 transition">
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
}
