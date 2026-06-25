import { useState } from "react";
import { X, Loader2, Eye, EyeOff } from "lucide-react";
import type { UserDTO } from "../../../model/AuthModel";
import { createUser, type CreateUserPayload } from "../../../apis/userApi";

type Props = {
    onClose: () => void;
    onCreated: (user: UserDTO) => void;
};

const ROLES = [
    { value: "CUSTOMER", label: "Customer" },
    { value: "SELLER", label: "Seller" },
    { value: "ADMIN", label: "Admin" },
];

type FormState = {
    fullName: string;
    email: string;
    password: string;
    phone: string;
    role: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const PHONE_REGEX = /^(\+?[0-9]{9,15})?$/;

export default function UserCreateModal({ onClose, onCreated }: Props) {
    const [form, setForm] = useState<FormState>({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        role: "CUSTOMER",
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [serverError, setServerError] = useState("");
    const [saving, setSaving] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
        setServerError("");
    };

    const validate = (): boolean => {
        const errs: FormErrors = {};

        if (!form.fullName.trim()) {
            errs.fullName = "Họ tên không được để trống.";
        }
        if (!form.email.trim()) {
            errs.email = "Email không được để trống.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            errs.email = "Định dạng email không hợp lệ.";
        }
        if (!form.password) {
            errs.password = "Mật khẩu không được để trống.";
        } else if (!PASSWORD_REGEX.test(form.password)) {
            errs.password = "Tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt (@$!%*?&).";
        }
        if (form.phone && !PHONE_REGEX.test(form.phone)) {
            errs.phone = "Số điện thoại không hợp lệ (9–15 chữ số).";
        }

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setSaving(true);
        setServerError("");
        try {
            const payload: CreateUserPayload = {
                fullName: form.fullName.trim(),
                email: form.email.trim(),
                password: form.password,
                phone: form.phone.trim() || undefined,
                role: form.role,
            };
            const created = await createUser(payload);
            onCreated(created);
        } catch (err: unknown) {
            const msg =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
                "Tạo tài khoản thất bại. Vui lòng thử lại.";
            setServerError(msg);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b px-6 py-5">
                    <h2 className="text-lg font-black text-slate-900">Thêm người dùng mới</h2>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="space-y-4 px-6 py-5">
                    {/* Họ tên */}
                    <Field label="Họ và tên *" error={errors.fullName}>
                        <input
                            type="text"
                            value={form.fullName}
                            onChange={set("fullName")}
                            placeholder="Nguyễn Văn A"
                            className={inputCls(!!errors.fullName)}
                        />
                    </Field>

                    {/* Email */}
                    <Field label="Email *" error={errors.email}>
                        <input
                            type="email"
                            value={form.email}
                            onChange={set("email")}
                            placeholder="example@email.com"
                            className={inputCls(!!errors.email)}
                        />
                    </Field>

                    {/* Password */}
                    <Field label="Mật khẩu *" error={errors.password}>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={form.password}
                                onChange={set("password")}
                                placeholder="Tối thiểu 8 ký tự..."
                                className={inputCls(!!errors.password) + " pr-10"}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </Field>

                    {/* 2 cột: phone + role */}
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Số điện thoại" error={errors.phone}>
                            <input
                                type="text"
                                value={form.phone}
                                onChange={set("phone")}
                                placeholder="0901234567"
                                className={inputCls(!!errors.phone)}
                            />
                        </Field>

                        <Field label="Vai trò">
                            <select
                                value={form.role}
                                onChange={set("role")}
                                className={inputCls(false)}
                            >
                                {ROLES.map((r) => (
                                    <option key={r.value} value={r.value}>
                                        {r.label}
                                    </option>
                                ))}
                            </select>
                        </Field>
                    </div>

                    {serverError && (
                        <p className="rounded-xl bg-rose-50 px-4 py-2.5 text-xs font-medium text-rose-600">
                            {serverError}
                        </p>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 border-t px-6 py-4">
                    <button
                        onClick={onClose}
                        className="rounded-xl border border-slate-200 px-5 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-60"
                    >
                        {saving && <Loader2 size={14} className="animate-spin" />}
                        Tạo tài khoản
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function inputCls(hasError: boolean) {
    return `w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition ${
        hasError
            ? "border-rose-300 focus:ring-rose-300 bg-rose-50"
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
