import React, { useState } from "react"

type User = {
  username?: string
  name: string
  email: string
  phone?: string
  gender?: string
  status?: string
  address?: string
}

export default function ProfileEditForm({ user }: { user: User }) {
  const [form, setForm] = useState<User>({ ...user })
  const [saving, setSaving] = useState(false)

  const onChange =
    (k: keyof User) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((s) => ({ ...s, [k]: e.target.value }))
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      // TODO: handle response / show toast
    } catch {
      // TODO: show error
    } finally {
      setSaving(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
    >
      <div className="rounded-md border border-gray-600 p-4 sm:col-span-2">
        <h3 className="text-sm font-semibold text-gray-600">Tên đăng nhập</h3>
        <input
          type="text"
          className="mt-1 h-10 w-full rounded-md border border-gray-300 px-3"
          value={form.username ?? ""}
          onChange={onChange("username")}
        />
      </div>

      <div className="rounded-md border border-gray-600 p-4">
        <h3 className="text-sm font-semibold text-gray-600">Họ và tên</h3>
        <input
          type="text"
          className="mt-1 h-10 w-full rounded-md border border-gray-300 px-3"
          value={form.name}
          onChange={onChange("name")}
        />
      </div>

      <div className="rounded-md border border-gray-600 p-4">
        <h3 className="text-sm font-semibold text-gray-600">Email</h3>
        <input
          type="email"
          className="mt-1 h-10 w-full rounded-md border border-gray-300 px-3"
          value={form.email}
          onChange={onChange("email")}
        />
      </div>

      <div className="rounded-md border border-gray-600 p-4">
        <h3 className="text-sm font-semibold text-gray-600">Số điện thoại</h3>
        <input
          type="tel"
          className="mt-1 h-10 w-full rounded-md border border-gray-300 px-3"
          value={form.phone ?? ""}
          onChange={onChange("phone")}
        />
      </div>

      <div className="rounded-md border border-gray-600 p-4">
        <h3 className="text-sm font-semibold text-gray-600">Giới tính</h3>
        <div className="mt-2">
          <div className="mt-2 flex gap-6">

            <label className="flex items-center gap-2">
                <input
                    type="radio"
                    value="Nam"
                    checked={form.gender === "Nam"}
                    onChange={onChange("gender")}
                />
                Nam
            </label>

            <label className="flex items-center gap-2">
                <input
                    type="radio"
                    value="Nữ"
                    checked={form.gender === "Nữ"}
                    onChange={onChange("gender")}
                />
                Nữ
            </label>

            <label className="flex items-center gap-2">
                <input
                    type="radio"
                    value="Khác"
                    checked={form.gender === "Khác"}
                    onChange={onChange("gender")}
                />
                Khác
            </label>

            </div>
        </div>
      </div>
      <div className="rounded-md border border-gray-600 p-4 sm:col-span-2">
        <h3 className="text-sm font-semibold text-gray-600">Địa chỉ</h3>
        <textarea
          className="mt-1 min-h-[4rem] w-full rounded-md border px-3 py-2"
          value={form.address ?? ""}
          onChange={onChange("address")}
          rows={3}
        />
      </div>

      <div className="rounded-md border border-transparent p-4 sm:col-span-2">
        <button
            className="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            type="submit"
            disabled={saving}
        >
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>
    </form>
  )
}
