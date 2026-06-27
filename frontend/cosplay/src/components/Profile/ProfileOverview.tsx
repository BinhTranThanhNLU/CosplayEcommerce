import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Edit3,
  Ruler,
  Package,
  Mail,
  Phone,
  Calendar,
  ChevronRight,
  Settings,
  User as UserIcon,
} from "lucide-react";
import { getMyProfile } from "../../apis/profileApi";
import type { UserDTO } from "../../model/UserModel";

const quickLinks = [
  {
    href: "/profile/edit",
    icon: Edit3,
    title: "Chỉnh sửa thông tin",
    description: "Cập nhật thông tin cá nhân của bạn",
    color: "text-primary",
  },
  {
    href: "/profile/measurements",
    icon: Ruler,
    title: "Quản lý số đo",
    description: "Lưu và chỉnh sửa số đo cơ thể",
    color: "text-primary",
  },
  {
    href: "/profile/orders",
    icon: Package,
    title: "Lịch sử đơn hàng",
    description: "Xem các đơn hàng đã đặt",
    color: "text-primary",
  },
  {
    href: "/change-password",
    icon: Settings,
    title: "Đổi mật khẩu",
    description: "Thay đổi mật khẩu tài khoản",
    color: "text-muted-foreground",
  },
];

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

// Skeleton placeholder khi đang tải
function ProfileSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-6">
      <div className="flex flex-col items-center gap-3">
        <div className="h-20 w-20 rounded-full bg-gray-200" />
        <div className="h-4 w-32 rounded bg-gray-200" />
        <div className="h-6 w-24 rounded-full bg-gray-200" />
      </div>
      <hr />
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="mt-0.5 h-4 w-4 rounded bg-gray-200" />
          <div className="flex-1 space-y-1">
            <div className="h-3 w-16 rounded bg-gray-200" />
            <div className="h-4 w-40 rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProfileOverview() {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Hiển thị nhanh từ localStorage trước
    const cached = localStorage.getItem("user");
    if (cached) {
      try {
        setUser(JSON.parse(cached) as UserDTO);
      } catch {
        // ignore parse errors
      }
    }

    // Sau đó đồng bộ dữ liệu mới nhất từ API
    getMyProfile()
      .then((data) => {
        setUser(data);
        // Cập nhật lại localStorage để các trang khác dùng được
        localStorage.setItem("user", JSON.stringify(data));
      })
      .catch(() => {
        setError("Không thể tải thông tin tài khoản.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border/60 bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-5 md:px-6">
          <nav className="mb-3 text-sm text-gray-500">
            <Link to="/">Trang chủ</Link>
            <span className="mx-2">/</span>
            <span>Thông tin cá nhân</span>
          </nav>

          <h1 className="text-2xl font-extrabold tracking-tight">
            Thông tin cá nhân
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Quản lý thông tin tài khoản và số đo của bạn
          </p>
        </div>
      </div>

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-3">
            {/* ================= Profile Card ================= */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm lg:col-span-1">
              <div className="flex items-center justify-between border-b px-6 py-4">
                <h2 className="text-base font-semibold">Hồ sơ</h2>
                <Link
                  to="/profile/edit"
                  className="rounded-md p-2 transition hover:bg-gray-100"
                  title="Chỉnh sửa"
                >
                  <Edit3 className="h-4 w-4" />
                </Link>
              </div>

              {loading && !user ? (
                <ProfileSkeleton />
              ) : (
                <div className="space-y-4 p-6">
                  <div className="flex flex-col items-center text-center">
                    {user?.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.fullName}
                        className="h-20 w-20 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">
                        {user?.fullName?.charAt(0)?.toUpperCase() ?? (
                          <UserIcon className="h-8 w-8" />
                        )}
                      </div>
                    )}

                    <h2 className="mt-3 text-lg font-bold">
                      {user?.fullName ?? "—"}
                    </h2>

                    <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                      <span className="h-2 w-2 rounded-full bg-green-500" />
                      Hoạt động
                    </span>
                  </div>

                  <hr />

                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <Mail className="mt-0.5 h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="font-medium">{user?.email ?? "—"}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="mt-0.5 h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Số điện thoại</p>
                        <p className="font-medium">
                          {user?.phone ?? (
                            <span className="italic text-gray-400">
                              Chưa cập nhật
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="mt-0.5 h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Tham gia</p>
                        <p className="font-medium">
                          {formatDate(user?.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ================= Quick Links ================= */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm lg:col-span-2">
              <div className="border-b px-6 py-4">
                <h2 className="text-lg font-semibold">Quản lý tài khoản</h2>
              </div>

              <div className="grid gap-4 p-6 md:grid-cols-2">
                {quickLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="flex items-center justify-between rounded-lg border p-4 transition hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        <Icon className={`h-6 w-6 ${item.color}`} />
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-gray-500">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}