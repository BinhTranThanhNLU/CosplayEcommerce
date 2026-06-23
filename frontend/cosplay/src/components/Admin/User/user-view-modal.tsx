import { X, Mail, Phone, Calendar, ShieldCheck } from "lucide-react";
import type { UserDTO } from "../../../model/AuthModel";

type Props = {
    user: UserDTO;
    onClose: () => void;
};

const STATUS_LABEL: Record<string, string> = {
    ACTIVE: "Hoạt động",
    INACTIVE: "Không hoạt động",
    BANNED: "Bị khóa",
};

const ROLE_LABEL: Record<string, string> = {
    ADMIN: "Admin",
    SELLER: "Seller",
    CUSTOMER: "Customer",
};

export default function UserViewModal({ user, onClose }: Props) {
    const initials = (user.fullName || user.username || user.email)
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w.charAt(0).toUpperCase())
        .join("");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl">
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100"
                >
                    <X size={18} />
                </button>

                {/* Avatar + name */}
                <div className="flex flex-col items-center gap-3 rounded-t-3xl bg-gradient-to-br from-indigo-50 to-purple-50 p-8">
                    {user.avatarUrl ? (
                        <img
                            src={user.avatarUrl}
                            alt={user.fullName}
                            className="h-20 w-20 rounded-full object-cover ring-4 ring-white"
                        />
                    ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-600 text-2xl font-black text-white ring-4 ring-white">
                            {initials}
                        </div>
                    )}
                    <div className="text-center">
                        <p className="text-lg font-black text-slate-900">{user.fullName || user.username}</p>
                        <p className="text-sm text-slate-500">@{user.username}</p>
                    </div>
                    <div className="flex gap-2">
                        <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700">
                            {ROLE_LABEL[user.role] ?? user.role}
                        </span>
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${user.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : user.status === "BANNED" ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-600"}`}>
                            {STATUS_LABEL[user.status] ?? user.status}
                        </span>
                    </div>
                </div>

                {/* Details */}
                <div className="space-y-3 p-6">
                    <DetailRow icon={<Mail size={15} />} label="Email" value={user.email} />
                    <DetailRow icon={<Phone size={15} />} label="Điện thoại" value={user.phone || "—"} />
                    <DetailRow
                        icon={<Calendar size={15} />}
                        label="Ngày tham gia"
                        value={user.createdAt ? new Date(user.createdAt).toLocaleDateString("vi-VN") : "—"}
                    />
                    <DetailRow icon={<ShieldCheck size={15} />} label="ID" value={`#${user.id}`} />
                </div>

                <div className="border-t p-4 text-center">
                    <button
                        onClick={onClose}
                        className="rounded-xl bg-slate-100 px-6 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
            <span className="text-slate-400">{icon}</span>
            <span className="w-28 text-xs font-semibold text-slate-500">{label}</span>
            <span className="flex-1 text-sm font-medium text-slate-800">{value}</span>
        </div>
    );
}
