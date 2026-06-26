
import React from "react"
import { Link } from "react-router-dom";
import {
  User,
  Edit3,
  Ruler,
  Package,
  MapPin,
  Mail,
  Phone,
  Calendar,
  ChevronRight,
  Settings,
} from "lucide-react"

// Mock user data
const user = {
  name: "Nguyễn Văn A",
  email: "nguyenvana@example.com",
  phone: "0123 456 789",
  address: "123 Đường ABC, Quận 1, TP.HCM",
  avatar: null,
  joinDate: "15/01/2024",
  status: "active",
  stats: {
    orders: 12,
    measurements: 3,
    favorites: 8,
  },
}

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
]

export function ProfileOverview() {
  return (
    <div className="flex min-h-screen flex-col bg-background">

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
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Profile Card */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm lg:col-span-1">
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <h2 className="text-base font-semibold">Hồ sơ</h2>

                    <Link
                    to="/profile/edit"
                    className="rounded-md p-2 hover:bg-gray-100 transition"
                    >
                    <Edit3 className="h-4 w-4" />
                    </Link>
                </div>

                <div className="space-y-4 p-6">
                    <div className="flex flex-col items-center text-center">
                    {user.avatar ? (
                        <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-20 w-20 rounded-full object-cover"
                        />
                    ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">
                        {user.name.charAt(0)}
                        </div>
                    )}

                    <h2 className="mt-3 text-lg font-bold">{user.name}</h2>

                    <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                        Hoạt động
                    </span>
                    </div>

                    <hr />

                    <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                        <Mail className="mt-0.5 h-4 w-4 text-gray-500" />
                        <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="font-medium">{user.email}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Phone className="mt-0.5 h-4 w-4 text-gray-500" />
                        <div>
                        <p className="text-xs text-gray-500">Số điện thoại</p>
                        <p className="font-medium">{user.phone}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <MapPin className="mt-0.5 h-4 w-4 text-gray-500" />
                        <div>
                        <p className="text-xs text-gray-500">Địa chỉ</p>
                        <p className="font-medium">{user.address}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Calendar className="mt-0.5 h-4 w-4 text-gray-500" />
                        <div>
                        <p className="text-xs text-gray-500">Tham gia</p>
                        <p className="font-medium">{user.joinDate}</p>
                        </div>
                    </div>
                    </div>

                    <hr />

                    <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-2xl font-bold text-blue-600">
                        {user.stats.orders}
                        </p>
                        <p className="text-xs text-gray-500">Đơn hàng</p>
                    </div>

                    <div>
                        <p className="text-2xl font-bold text-blue-600">
                        {user.stats.measurements}
                        </p>
                        <p className="text-xs text-gray-500">Số đo</p>
                    </div>

                    <div>
                        <p className="text-2xl font-bold text-blue-600">
                        {user.stats.favorites}
                        </p>
                        <p className="text-xs text-gray-500">Yêu thích</p>
                    </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    </main>
</div>
)}