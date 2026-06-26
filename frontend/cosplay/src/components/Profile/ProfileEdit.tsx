import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Upload,
  Loader2,
  ArrowLeft,
  Save,
} from "lucide-react"

type FormErrors = {
  name?: string
  email?: string
  phone?: string
}

export function ProfileEdit() {
  const navigate = useNavigate()
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  // Mock user data
  const [formData, setFormData] = useState({
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0123 456 789",
    gender: "male",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    avatar: null as string | null,
  })

  const validate = (): boolean => {
    const newErrors: FormErrors = {}
    if (!formData.name.trim()) newErrors.name = "Vui lòng nhập họ tên"
    if (!formData.email.trim()) newErrors.email = "Vui lòng nhập email"
    if (!formData.phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSaving(true)
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)

    navigate("/profile");
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">

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
            <Link
                to="/profile"
                className="rounded-md p-2 hover:bg-gray-100"
            >
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
          <form onSubmit={handleSubmit}>
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b p-6">
                <h2 className="text-lg font-semibold">
                  Thông tin cá nhân
                </h2>
              </div>
              <div className="space-y-6 p-6">
                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <div className="h-20 w-20 overflow-hidden rounded-full bg-gray-200 flex items-center justify-center">
                    {formData.avatar && (<img src={formData.avatar} alt="" className="h-full w-full object-cover" />)}
                    {!formData.avatar && (
                      <span className="text-xl font-bold text-blue-600">
                        {formData.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium">
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

                {/* Name */}
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium">
                    Họ và tên <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                        if (e.target.value.trim()) {
                          setErrors((prev) => ({ ...prev, name: undefined }))
                        }
                      }}
                      onBlur={() => {
                        if (!formData.name.trim()) {
                          setErrors((prev) => ({
                            ...prev,
                            name: "Vui lòng nhập họ tên",
                          }))
                        }
                      }}
                      className={`pl-10 ${errors.name ? "border-destructive" : ""}`}
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-destructive">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                        if (e.target.value.trim()) {
                          setErrors((prev) => ({ ...prev, email: undefined }))
                        }
                      }}
                      onBlur={() => {
                        if (!formData.email.trim()) {
                          setErrors((prev) => ({
                            ...prev,
                            email: "Vui lòng nhập email",
                          }))
                        }
                      }}
                      className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                      placeholder="email@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium">
                    Số điện thoại <span className="text-destructive">*</span>
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
                        }))
                        if (e.target.value.trim()) {
                          setErrors((prev) => ({ ...prev, phone: undefined }))
                        }
                      }}
                      onBlur={() => {
                        if (!formData.phone.trim()) {
                          setErrors((prev) => ({
                            ...prev,
                            phone: "Vui lòng nhập số điện thoại",
                          }))
                        }
                      }}
                      className={`pl-10 ${errors.phone ? "border-destructive" : ""}`}
                      placeholder="0123 456 789"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-destructive">{errors.phone}</p>
                  )}
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <label htmlFor="gender" className="block text-sm font-medium">
                    Giới tính
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e)=>
                        setFormData({
                            ...formData,
                            gender:e.target.value
                        })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <label htmlFor="address">Địa chỉ</label>
                  <div className="relative">
                    <MapPin className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                    <textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                      className="min-h-[80px] resize-none pl-10"
                      placeholder="Số nhà, đường, quận/huyện, thành phố"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                    type="button"
                    onClick={() => navigate("/profile")}
                    disabled={isSaving}
                    className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Hủy
                </button>

                <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
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
        </div>
      </main>
    </div>
  )
}
