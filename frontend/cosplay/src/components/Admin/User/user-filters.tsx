import { Search } from "lucide-react";

type Props = {
    keyword: string;
    setKeyword: (v: string) => void;
    filterRole: string;
    setFilterRole: (v: string) => void;
    filterStatus: string;
    setFilterStatus: (v: string) => void;
};

const roles = [
    { value: "all", label: "Tất cả" },
    { value: "CUSTOMER", label: "Customer" },
    { value: "SELLER", label: "Seller" },
    { value: "ADMIN", label: "Admin" },
];

const statuses = [
    { value: "all", label: "Tất cả" },
    { value: "ACTIVE", label: "Hoạt động" },
    { value: "INACTIVE", label: "Không hoạt động" },
    { value: "BANNED", label: "Bị khóa" },
];

export default function UserFilters({
    keyword,
    setKeyword,
    filterRole,
    setFilterRole,
    filterStatus,
    setFilterStatus,
}: Props) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
            {/* Search input */}
            <div className="relative flex-1 min-w-[200px]">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Tìm theo tên, email, username..."
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
            </div>

            {/* Role filter */}
            <div className="flex rounded-xl bg-slate-100 p-1">
                {roles.map((r) => (
                    <button
                        key={r.value}
                        onClick={() => setFilterRole(r.value)}
                        className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
                            filterRole === r.value
                                ? "bg-white text-indigo-600 shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                        }`}
                    >
                        {r.label}
                    </button>
                ))}
            </div>

            {/* Status filter */}
            <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
                {statuses.map((s) => (
                    <option key={s.value} value={s.value}>
                        {s.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
