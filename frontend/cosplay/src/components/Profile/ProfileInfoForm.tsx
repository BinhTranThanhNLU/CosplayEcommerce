import React from "react"
import { Link } from "react-router-dom";

import {
  User,
  Mail,
  Phone,
  MapPin,
  CircleCheck,
  VenusAndMars,
} from "lucide-react";

type User = {
  username?: string
  name: string
  email: string
  avatarUrl?: string
  phone?: string
  gender?: string
  status?: string
  address?: string
}

export default function ProfileInfo({ user }: { user: User }) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .slice(-2)
    .join("")
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="p-6">
        <div className="mb-6 flex items-center space-x-4">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-200">
            {user.avatarUrl ? (
                <img
                src={user.avatarUrl}
                alt={user.name}
                className="h-full w-full object-cover"
                />
            ) : (
                <span className="font-semibold text-gray-700">{initials}</span>
            )}
          </div>
          <div>
            <h2 className="text-lg font-medium">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div className="rounded-md border border-gray-600 p-4">
            <div className="flex items-center gap-2">
              <User className="size-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-gray-500">
                Tên đăng nhập
              </h3>
            </div>
            <p className="mt-3">{user.username ?? "Chưa cập nhật"}</p>
          </div>

          <div className="rounded-md border border-gray-600 p-4">
            <div className="flex items-center gap-2">
              <User className="size-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-gray-500">Họ và tên</h3>
            </div>
            <p className="mt-3">{user.name ?? "Chưa cập nhật"}</p>
          </div>

          <div className="rounded-md border border-gray-600 p-4">
            <div className="flex items-center gap-2">
              <Mail className="size-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-gray-500">Email</h3>
            </div>
            <p className="mt-3">{user.email ?? "Chưa cập nhật"}</p>
          </div>

          <div className="rounded-md border border-gray-600 p-4">
            <div className="flex items-center gap-2">
              <Phone className="size-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-gray-500">
                Số điện thoại
              </h3>
            </div>
            <p className="mt-3">{user.phone ?? "Chưa cập nhật"}</p>
          </div>

          <div className="rounded-md border border-gray-600 p-4">
            <div className="flex items-center gap-2">
              <VenusAndMars className="size-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-gray-500">Giới tính</h3>
            </div>
            <p className="mt-3">{user.gender ?? "Chưa cập nhật"}</p>
          </div>

          <div className="rounded-md border border-gray-600 p-4">
            <div className="flex items-center gap-2">
              <CircleCheck className="size-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-gray-500">
                Trạng thái
              </h3>
            </div>
            <p className="mt-3">{user.status ?? "Chưa cập nhật"}</p>
          </div>

          <div className="rounded-md border border-gray-600 p-4 sm:col-span-2 md:col-span-3">
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-gray-500">Địa chỉ</h3>
            </div>
            <p className="mt-3">{user.address ?? "Chưa cập nhật"}</p>
          </div>

          <div className="mt-4 rounded-md border border-transparent p-4 sm:col-span-2 md:col-span-3">
            <Link
              to="/profile/edit"
              className="inline-block rounded-md bg-sky-600 px-4 py-2 text-center text-white"
            >
              Chỉnh sửa thông tin
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
