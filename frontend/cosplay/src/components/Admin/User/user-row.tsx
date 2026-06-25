import { Eye, Edit2, Ban, ShieldCheck, Trash2 } from "lucide-react";
import type { UserDTO } from "../../../model/AuthModel";

type Props = {
    user: UserDTO;
    onView: (user: UserDTO) => void;
    onEdit: (user: UserDTO) => void;
    onToggleBan: (user: UserDTO) => void;
    onDelete: (user: UserDTO) => void;
};

const ROLE_STYLE: Record<string, string> = {
    ADMIN:    "border-purple-100 bg-purple-50 text-purple-600",
    SELLER:   "border-amber-100 bg-amber-50 text-amber-600",
    CUSTOMER: "border-blue-100 bg-blue-50 text-blue-600",
};

const ROLE_LABEL: Record<string, string> = {
    ADMIN: "Admin",
    SELLER: "Seller",
    CUSTOMER: "Customer",
};

const STATUS_DOT: Record<string, string> = {
    ACTIVE:   "animate-pulse bg-emerald-500",
    INACTIVE: "bg-slate-300",
    BANNED:   "bg-rose-500",
};

const STATUS_TEXT: Record<string, string> = {
    ACTIVE:   "text-emerald-600",
    INACTIVE: "text-slate-400",
    BANNED:   "text-rose-500",
};

const STATUS_LABEL: Record<string, string> = {
    ACTIVE:   "Hoạt động",
    INACTIVE: "Không hoạt động",
    BANNED:   "Bị khóa",
};

export default function UserRow({ user, onView, onEdit, onToggleBan, onDelete }: Props) {
    const isBanned = user.status === "BANNED";
    const initials = (user.fullName || user.username || user.email)
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w.charAt(0).toUpperCase())
        .join("");

    const joinDate = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("vi-VN")
        : "—";

    return (
        <tr className="group transition-colors hover:bg-slate-50">
            {/* User info */}
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    {user.avatarUrl ? (
                        <img
                            src={user.avatarUrl}
                            alt={user.fullName}
                            className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
                        />
                    ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 ring-2 ring-white">
                            {initials}
                        </div>
                    )}
                    <div>
                        <p className="text-sm font-bold text-slate-900">{user.fullName || user.username}</p>
                        <p className="text-[11px] text-slate-400">{user.email}</p>
                    </div>
                </div>
            </td>

            {/* Role */}
            <td className="px-6 py-4">
                <span className={`rounded-lg border px-2.5 py-1 text-[10px] font-black tracking-wide uppercase ${ROLE_STYLE[user.role] ?? "border-slate-100 bg-slate-50 text-slate-600"}`}>
                    {ROLE_LABEL[user.role] ?? user.role}
                </span>
            </td>

            {/* Status */}
            <td className="px-6 py-4">
                <div className="flex items-center gap-1.5">
                    <div className={`h-2 w-2 rounded-full ${STATUS_DOT[user.status] ?? "bg-slate-300"}`} />
                    <span className={`text-xs font-bold ${STATUS_TEXT[user.status] ?? "text-slate-400"}`}>
                        {STATUS_LABEL[user.status] ?? user.status}
                    </span>
                </div>
            </td>

            {/* Phone */}
            <td className="px-6 py-4 text-sm text-slate-500">
                {user.phone || "—"}
            </td>

            {/* Join date */}
            <td className="px-6 py-4 text-xs text-slate-500">{joinDate}</td>

            {/* Actions */}
            <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-1 opacity-0 transition group-hover:opacity-100">
                    <button
                        title="Xem chi tiết"
                        onClick={() => onView(user)}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"
                    >
                        <Eye size={15} />
                    </button>
                    <button
                        title="Chỉnh sửa"
                        onClick={() => onEdit(user)}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                        <Edit2 size={15} />
                    </button>
                    <button
                        title={isBanned ? "Mở khóa tài khoản" : "Khóa tài khoản"}
                        onClick={() => onToggleBan(user)}
                        className={`rounded-lg p-2 transition ${
                            isBanned
                                ? "text-slate-400 hover:bg-emerald-50 hover:text-emerald-600"
                                : "text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                        }`}
                    >
                        {isBanned ? <ShieldCheck size={15} /> : <Ban size={15} />}
                    </button>
                    <button
                        title="Xóa người dùng"
                        onClick={() => onDelete(user)}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                    >
                        <Trash2 size={15} />
                    </button>
                </div>
            </td>
        </tr>
    );
}
