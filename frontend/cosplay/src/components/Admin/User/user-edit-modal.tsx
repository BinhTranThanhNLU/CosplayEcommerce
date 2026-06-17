import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import type { UserDTO } from "../../../model/AuthModel";
import { updateUser, changeUserRole, type UpdateUserPayload } from "../../../apis/userApi";

type Props = {
    user: UserDTO;
    onClose: () => void;
    onSaved: (updated: UserDTO) => void;
};

const ROLES = ["CUSTOMER", "SELLER", "ADMIN"];
const ROLE_LABEL: Record<string, string> = {
    ADMIN: "Admin",
    SELLER: "Seller",
    CUSTOMER: "Customer",
};

export default function UserEditModal({ user, onClose, onSaved }: Props) {
    const [fullName, setFullName] = useState(user.fullName || "");
    const [phone, setPhone] = useState(user.phone || "");
    const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || "");
    const [role, setRole] = useState(user.role);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const handleSave = async () => {
        if (!fullName.trim()) {
            setError("Họ tên không được để trống.");
            return;
        }
        setSaving(true);
        setError("");
        try {
            const payload: UpdateUserPayload = { fullName, phone, avatarUrl };
            let updated = await updateUser(user.id, payload);

            // Nếu role thay đổi, gọi thêm API đổi role
            if (role !== user.role) {
                updated = await changeUserRole(user.id, role);
            }

            onSaved(updated);
        } catch {
            setError("Lưu thông tin thất bại. Vui lòng thử lại.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100"
                >
                    <X size={18} />
                </button>

                <div className="p-6">
                    <h2 className="mb-5 text-lg font-black text-slate-900">Chỉnh sửa người dùng</h2>

                    <div className="space-y-4">
                        <Field label="Họ và tên *">
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                        </Field>

                        <Field label="Số điện thoại">
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="0901234567"
                                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                        </Field>

                        <Field label="URL Ảnh đại diện">
                            <input
                                type="text"
                                value={avatarUrl}
                                onChange={(e) => setAvatarUrl(e.target.value)}
                                placeholder="https://..."
                                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                        </Field>

                        <Field label="Vai trò">
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            >
                                {ROLES.map((r) => (
                                    <option key={r} value={r}>
                                        {ROLE_LABEL[r]}
                                    </option>
                                ))}
                            </select>
                        </Field>
                    </div>

                    {error && <p className="mt-3 text-xs text-rose-500">{error}</p>}
                </div>

                <div className="flex justify-end gap-3 border-t px-6 py-4">
                    <button
                        onClick={onClose}
                        className="rounded-xl border border-slate-200 px-5 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-60"
                    >
                        {saving && <Loader2 size={14} className="animate-spin" />}
                        Lưu thay đổi
                    </button>
                </div>
            </div>
        </div>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-500">{label}</label>
            {children}
        </div>
    );
}
