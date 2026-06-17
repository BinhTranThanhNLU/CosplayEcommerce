import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import type { UserDTO } from "../../../model/AuthModel";
import { updateUser, type UpdateUserPayload } from "../../../apis/userApi";

type Props = {
    user: UserDTO;
    onClose: () => void;
    onSaved: (updated: UserDTO) => void;
};

const ROLES = [
    { value: "CUSTOMER", label: "Customer" },
    { value: "SELLER",   label: "Seller"   },
    { value: "ADMIN",    label: "Admin"    },
];

const PHONE_REGEX = /^(\+?[0-9]{9,15})?$/;

type FormErrors = {
    fullName?: string;
    phone?: string;
    avatarUrl?: string;
};

export default function UserEditModal({ user, onClose, onSaved }: Props) {
    const [fullName,  setFullName]  = useState(user.fullName  ?? "");
    const [phone,     setPhone]     = useState(user.phone     ?? "");
    const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl ?? "");
    const [role,      setRole]      = useState(user.role      ?? "CUSTOMER");

    const [errors,      setErrors]      = useState<FormErrors>({});
    const [serverError, setServerError] = useState("");
    const [saving,      setSaving]      = useState(false);

    // Clear field error khi user sửa
    const clearErr = (field: keyof FormErrors) =>
        setErrors((prev) => ({ ...prev, [field]: undefined }));

    const validate = (): boolean => {
        const errs: FormErrors = {};
        if (!fullName.trim()) {
            errs.fullName = "Họ tên không được để trống.";
        }
        if (phone && !PHONE_REGEX.test(phone.trim())) {
            errs.phone = "Số điện thoại không hợp lệ (9–15 chữ số).";
        }
        if (avatarUrl.trim() && avatarUrl.trim().length > 500) {
            errs.avatarUrl = "URL không được vượt quá 500 ký tự.";
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;

        setSaving(true);
        setServerError("");
        try {
            const payload: UpdateUserPayload = {
                fullName: fullName.trim(),
                phone:     phone.trim()     || undefined,
                avatarUrl: avatarUrl.trim() || undefined,
                role,
            };
            const updated = await updateUser(user.id, payload);
            onSaved(updated);
        } catch (err: unknown) {
            const msg =
                (err as { response?: { data?: { message?: string } } })
                    ?.response?.data?.message ?? "Lưu thông tin thất bại. Vui lòng thử lại.";
            setServerError(msg);
        } finally {
            setSaving(false);
        }
    };

    const hasChanges =
        fullName.trim()  !== (user.fullName  ?? "").trim()  ||
        phone.trim()     !== (user.phone     ?? "").trim()  ||
        avatarUrl.trim() !== (user.avatarUrl ?? "").trim()  ||
        role             !== (user.role      ?? "CUSTOMER");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between border-b px-6 py-5">
                    <div>
                        <h2 className="text-lg font-black text-slate-900">Chỉnh sửa người dùng</h2>
                        <p className="text-xs text-slate-400 mt-0.5">#{user.id} · {user.email}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 transition"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Avatar preview */}
                <div className="flex items-center gap-4 bg-slate-50 px-6 py-4 border-b">
                    {avatarUrl.trim() ? (
                        <img
                            src={avatarUrl.trim()}
                            alt="avatar"
                            className="h-12 w-12 rounded-full object-cover ring-2 ring-white shadow"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                    ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-sm font-black text-indigo-700 ring-2 ring-white shadow">
                            {(fullName || user.username || user.email)
                                .split(/\s+/).slice(0, 2)
                                .map((w) => w[0]?.toUpperCase()).join("")}
                        </div>
                    )}
                    <div>
                        <p className="text-sm font-bold text-slate-800">{fullName || "(chưa có tên)"}</p>
                        <p className="text-xs text-slate-400">@{user.username}</p>
                    </div>
                </div>

                {/* Form */}
                <div className="space-y-4 px-6 py-5">

                    {/* Họ tên */}
                    <Field label="Họ và tên *" error={errors.fullName}>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => { setFullName(e.target.value); clearErr("fullName"); }}
                            placeholder="Nguyễn Văn A"
                            className={inputCls(!!errors.fullName)}
                        />
                    </Field>

                    {/* Số điện thoại */}
                    <Field label="Số điện thoại" error={errors.phone}>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => { setPhone(e.target.value); clearErr("phone"); }}
                            placeholder="0901234567"
                            className={inputCls(!!errors.phone)}
                        />
                    </Field>

                    {/* Avatar URL */}
                    <Field label="URL ảnh đại diện" error={errors.avatarUrl}>
                        <input
                            type="text"
                            value={avatarUrl}
                            onChange={(e) => { setAvatarUrl(e.target.value); clearErr("avatarUrl"); }}
                            placeholder="https://example.com/avatar.jpg"
                            className={inputCls(!!errors.avatarUrl)}
                        />
                    </Field>

                    {/* Vai trò */}
                    <Field label="Vai trò">
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className={inputCls(false)}
                        >
                            {ROLES.map((r) => (
                                <option key={r.value} value={r.value}>{r.label}</option>
                            ))}
                        </select>
                    </Field>

                    {/* Server error */}
                    {serverError && (
                        <p className="rounded-xl bg-rose-50 px-4 py-2.5 text-xs font-medium text-rose-600">
                            {serverError}
                        </p>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t px-6 py-4">
                    <p className="text-xs text-slate-400">
                        {hasChanges ? "Có thay đổi chưa lưu" : "Chưa có thay đổi"}
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="rounded-xl border border-slate-200 px-5 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 transition"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving || !hasChanges}
                            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            {saving && <Loader2 size={14} className="animate-spin" />}
                            Lưu thay đổi
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function inputCls(hasError: boolean) {
    return `w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition ${
        hasError
            ? "border-rose-300 bg-rose-50 focus:ring-rose-300"
            : "border-slate-200 focus:ring-indigo-400"
    }`;
}

function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-500">{label}</label>
            {children}
            {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
        </div>
    );
}
