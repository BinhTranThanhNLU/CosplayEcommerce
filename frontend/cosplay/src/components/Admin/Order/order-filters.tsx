import { Search } from "lucide-react";

const STATUS_TABS = [
    { value: "all",        label: "Tất cả"        },
    { value: "PENDING",    label: "Chờ xác nhận"  },
    { value: "PROCESSING", label: "Đang xử lý"    },
    { value: "SHIPPED",    label: "Đang giao"      },
    { value: "COMPLETED",  label: "Hoàn thành"     },
    { value: "CANCELLED",  label: "Đã hủy"         },
];

type Props = {
    keyword: string;
    setKeyword: (v: string) => void;
    filterStatus: string;
    setFilterStatus: (v: string) => void;
};

export default function OrderFilters({ keyword, setKeyword, filterStatus, setFilterStatus }: Props) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[220px]">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Tìm theo mã đơn, khách hàng, shop..."
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
            </div>

            {/* Status tabs */}
            <div className="flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1">
                {STATUS_TABS.map((t) => (
                    <button
                        key={t.value}
                        onClick={() => setFilterStatus(t.value)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                            filterStatus === t.value
                                ? "bg-white text-indigo-600 shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
