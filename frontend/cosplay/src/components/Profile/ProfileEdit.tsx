import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Upload,
  Loader2,
  ArrowLeft,
  Save,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { getMyProfile, updateMyProfile } from "../../apis/profileApi";
import type { UserDTO } from "../../model/UserModel";

type FormErrors = {
  fullName?: string;
  phone?: string;
};

type ToastState = {
  type: "success" | "error";
  message: string;
} | null;

export function ProfileEdit() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});
  const [toast, setToast] = useState<ToastState>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    avatarUrl: null as string | null,
    // Preview ảnh local (base64), chỉ dùng hiển thị, không gửi lên BE
    avatarPreview: null as string | null,
  });

  // Load dữ liệu hiện tại từ API (hoặc localStorage nếu đã có)
  useEffect(() => {
    const cached = localStorage.getItem("user");
    if (cached) {
      try {
        const u: UserDTO = JSON.parse(cached);
        setFormData({
          fullName: u.fullName ?? "",
          email: u.email ?? "",
          phone: u.phone ?? "",
          avatarUrl: u.avatarUrl ?? null,
          avatarPreview: null,
        });
      } catch {
        // ignore
      }
    }

    getMyProfile()
      .then((u) => {
        setFormData({
          fullName: u.fullName ?? "",
          email: u.email ?? "",
          phone: u.phone ?? "",
          avatarUrl: u.avatarUrl ?? null,
          avatarPreview: null,
        });
      })
      .catch(() => {
        // giữ nguyên dữ liệu từ localStorage nếu API lỗi
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Tự động ẩn toast sau 3 giây
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.fullName.trim())
      newErrors.fullName = "Vui lòng nhập họ tên";
    if (
      formData.phone.trim() &&
      !/^\+?[0-9]{9,15}$/.test(formData.phone.trim())
    )
      newErrors.phone = "Số điện thoại không hợp lệ (9–15 chữ số)";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    try {
      const updated = await updateMyProfile({
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim() || undefined,
        avatarUrl: formData.avatarUrl ?? undefined,
      });

      // Cập nhật lại localStorage
      const cached = localStorage.getItem("user");
      if (cached) {
        try {
          const prev: UserDTO = JSON.parse(cached);
          localStorage.setItem(
            "user",
            JSON.stringify({ ...prev, ...updated })
          );
        } catch {
          localStorage.setItem("user", JSON.stringify(updated));
        }
      }

      setToast({ type: "success", message: "Cập nhật thông tin thành công!" });
      setTimeout(() => navigate("/profile"), 1200);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Đã xảy ra lỗi. Vui lòng thử lại.";
      setToast({ type: "error", message: msg });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setToast({ type: "error", message: "Ảnh không được vượt quá 2MB." });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      // Lưu base64 làm preview, nhưng avatarUrl giữ nguyên URL cũ (upload thực sẽ cần storage API riêng)
      setFormData((prev) => ({
        ...prev,
        avatarPreview: reader.result as string,
        // TODO: Nếu có upload API, thay thế dòng dưới bằng URL trả về từ server
        avatarUrl: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const displayAvatar = formData.avatarPreview ?? formData.avatarUrl;
  const avatarInitial = formData.fullName?.charAt(0)?.toUpperCase() ?? "U";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed right-4 top-4 z-50 flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium shadow-lg transition-all ${
            toast.type === "success"
              ? "border border-green-200 bg-green-50 text-green-800"
              : "border border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="border-b border-border/60 bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-5 md:px-6">
          <nav className="mb-4 text-sm text-gray-500">
            <Link to="/">Trang chủ</Link>
            <span className="mx-2">/</span>
            <Link to="/profile">Thông tin cá nhân</Link>
            <span className="mx-2">/</span>
            <span>Chỉnh sửa</span>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/profile" className="rounded-md p-2 hover:bg-gray-100">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">
                Chỉnh sửa thông tin
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Cập nhật thông tin cá nhân của bạn
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8 md:px-6">
          {isLoading ? (
            // Skeleton loading khi đang tải dữ liệu ban đầu
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="animate-pulse space-y-6 p-6">
                <div className="flex items-center gap-6">
                  <div className="h-20 w-20 rounded-full bg-gray-200" />
                  <div className="space-y-2">
                    <div className="h-8 w-28 rounded bg-gray-200" />
                    <div className="h-3 w-40 rounded bg-gray-200" />
                  </div>
                </div>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-3 w-20 rounded bg-gray-200" />
                    <div className="h-10 w-full rounded-md bg-gray-200" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b p-6">
                  <h2 className="text-lg font-semibold">Thông tin cá nhân</h2>
                </div>
                <div className="space-y-6 p-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-6">
                    <div className="h-20 w-20 overflow-hidden rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                      {displayAvatar ? (
                        <img
                          src={displayAvatar}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-xl font-bold text-blue-600">
                          {avatarInitial}
                        </span>
                      )}
                    </div>
                    <div>
                      <label htmlFor="avatar" className="cursor-pointer">
                        <div className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 transition-colors hover:bg-muted">
                          <Upload className="h-4 w-4" />
                          <span className="text-sm font-medium">Tải ảnh lên</span>
                        </div>
                        <input
                          id="avatar"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleAvatarChange}
                        />
                      </label>
                      <p className="mt-2 text-xs text-muted-foreground">
                        JPG, PNG hoặc WebP. Tối đa 2MB.
                      </p>
                    </div>
                  </div>

                  {/* Họ và tên */}
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="block text-sm font-medium">
                      Họ và tên <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            fullName: e.target.value,
                          }));
                          if (e.target.value.trim()) {
                            setErrors((prev) => ({
                              ...prev,
                              fullName: undefined,
                            }));
                          }
                        }}
                        onBlur={() => {
                          if (!formData.fullName.trim()) {
                            setErrors((prev) => ({
                              ...prev,
                              fullName: "Vui lòng nhập họ tên",
                            }));
                          }
                        }}
                        className={`w-full rounded-md border px-3 py-2 pl-10 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.fullName
                            ? "border-red-400"
                            : "border-gray-300"
                        }`}
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-xs text-red-600">{errors.fullName}</p>
                    )}
                  </div>

                  {/* Email (chỉ đọc) */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium">
                      Email
                      <span className="ml-2 text-xs font-normal text-gray-400">
                        (không thể thay đổi)
                      </span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                      <input
                        id="email"
                        type="email"
                        value={formData.email}
                        readOnly
                        className="w-full cursor-not-allowed rounded-md border border-gray-200 bg-gray-50 px-3 py-2 pl-10 text-sm text-gray-500"
                      />
                    </div>
                  </div>

                  {/* Số điện thoại */}
                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-medium">
                      Số điện thoại
                    </label>
                    <div className="relative">
                      <Phone className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                      <input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }));
                          if (errors.phone) {
                            setErrors((prev) => ({
                              ...prev,
                              phone: undefined,
                            }));
                          }
                        }}
                        onBlur={() => {
                          if (
                            formData.phone.trim() &&
                            !/^\+?[0-9]{9,15}$/.test(formData.phone.trim())
                          ) {
                            setErrors((prev) => ({
                              ...prev,
                              phone: "Số điện thoại không hợp lệ (9–15 chữ số)",
                            }));
                          }
                        }}
                        className={`w-full rounded-md border px-3 py-2 pl-10 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.phone ? "border-red-400" : "border-gray-300"
                        }`}
                        placeholder="0123456789"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-xs text-red-600">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/profile")}
                  disabled={isSaving}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Lưu thay đổi
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
