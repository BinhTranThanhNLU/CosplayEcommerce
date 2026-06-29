import { useState, useEffect, type ChangeEvent } from "react"
import { Link } from "react-router-dom"
import {
  Ruler,
  Plus,
  Edit3,
  Trash2,
  Download,
  Upload,
  Info,
  CheckCircle,
  AlertCircle,
  X,
  Loader2,
} from "lucide-react"
import {
  getMyMeasurements,
  createMeasurement,
  updateMeasurement,
  deleteMeasurement,
  type MeasurementDTO,
  type SaveMeasurementPayload,
} from "../../apis/measurementApi"

// ─── Types ────────────────────────────────────────────────────────────────────

type FormData = {
  profileName: string
  height: string
  weight: string
  bust: string
  waist: string
  hips: string
  shoulder: string
}

type FieldErrors = Partial<Record<keyof FormData, string>>
type ToastState = { type: "success" | "error"; message: string } | null

// ─── Constants ────────────────────────────────────────────────────────────────

const EMPTY_FORM: FormData = {
  profileName: "",
  height: "",
  weight: "",
  bust: "",
  waist: "",
  hips: "",
  shoulder: "",
}

const measurementFields: {
  key: keyof Omit<FormData, "profileName">
  label: string
  unit: string
  placeholder: string
  min: number
  max: number
}[] = [
  { key: "height",   label: "Chiều cao", unit: "cm", placeholder: "168", min: 50,  max: 250 },
  { key: "weight",   label: "Cân nặng",  unit: "kg", placeholder: "55",  min: 20,  max: 300 },
  { key: "bust",     label: "Vòng ngực", unit: "cm", placeholder: "86",  min: 40,  max: 200 },
  { key: "waist",    label: "Vòng eo",   unit: "cm", placeholder: "68",  min: 30,  max: 200 },
  { key: "hips",     label: "Vòng mông", unit: "cm", placeholder: "90",  min: 40,  max: 200 },
  { key: "shoulder", label: "Vai rộng",  unit: "cm", placeholder: "38",  min: 20,  max: 100 },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const toPayload = (form: FormData): SaveMeasurementPayload => ({
  profileName: form.profileName.trim(),
  height:   form.height   ? parseFloat(form.height)   : null,
  weight:   form.weight   ? parseFloat(form.weight)   : null,
  bust:     form.bust     ? parseFloat(form.bust)     : null,
  waist:    form.waist    ? parseFloat(form.waist)    : null,
  hips:     form.hips     ? parseFloat(form.hips)     : null,
  shoulder: form.shoulder ? parseFloat(form.shoulder) : null,
})

const toForm = (m: MeasurementDTO): FormData => ({
  profileName: m.profileName ?? "",
  height:   m.height   != null ? String(m.height)   : "",
  weight:   m.weight   != null ? String(m.weight)   : "",
  bust:     m.bust     != null ? String(m.bust)     : "",
  waist:    m.waist    != null ? String(m.waist)    : "",
  hips:     m.hips     != null ? String(m.hips)     : "",
  shoulder: m.shoulder != null ? String(m.shoulder) : "",
})

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

// ─── CSS helpers ──────────────────────────────────────────────────────────────

const btnPrimary =
  "inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
const btnOutline =
  "inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
const btnGhost =
  "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
const btnIcon =
  "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50"
const inputBase =
  "h-10 w-full rounded-lg border px-3 text-sm outline-none transition focus:ring-2"
const inputNormal = `${inputBase} border-gray-200 bg-white focus:border-blue-400 focus:ring-blue-100`
const inputError  = `${inputBase} border-red-400 bg-white focus:border-red-400 focus:ring-red-100`

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function MeasurementSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 space-y-2 border-b pb-4">
            <div className="h-4 w-32 rounded bg-gray-200" />
            <div className="h-3 w-20 rounded bg-gray-200" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4, 5, 6].map((j) => (
              <div key={j} className="space-y-1">
                <div className="h-3 w-16 rounded bg-gray-200" />
                <div className="h-4 w-20 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ProfileMeasurements() {
  const [measurements, setMeasurements] = useState<MeasurementDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<ToastState>(null)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  // Load dữ liệu thực từ API
  useEffect(() => {
    fetchMeasurements()
  }, [])

  // Tự ẩn toast sau 3s
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(t)
  }, [toast])

  const fetchMeasurements = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getMyMeasurements()
      setMeasurements(data)
    } catch {
      setError("Không thể tải danh sách số đo. Vui lòng thử lại.")
    } finally {
      setLoading(false)
    }
  }

  const showToast = (type: "success" | "error", message: string) =>
    setToast({ type, message })

  // ── Validate ──────────────────────────────────────────────────────────────

  const validateField = (
    key: keyof FormData,
    value: string
  ): string | undefined => {
    if (key === "profileName") {
      return value.trim() ? undefined : "Vui lòng nhập tên bộ số đo"
    }
    if (!value.trim()) return undefined // tuỳ chọn
    const num = parseFloat(value)
    const field = measurementFields.find((f) => f.key === key)
    if (!field) return undefined
    if (isNaN(num) || num <= 0) return "Giá trị không hợp lệ"
    if (num < field.min || num > field.max)
      return `Phải trong khoảng ${field.min}–${field.max} ${field.unit}`
    return undefined
  }

  const handleFieldChange = (key: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
    const err = validateField(key, value)
    setFieldErrors((prev) => ({ ...prev, [key]: err }))
  }

  const validateAll = (): boolean => {
    const errs: FieldErrors = {}
    const keys = ["profileName", ...measurementFields.map((f) => f.key)] as (keyof FormData)[]
    for (const key of keys) {
      const err = validateField(key, formData[key])
      if (err) errs[key] = err
    }
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  // ── Dialog open/close ──────────────────────────────────────────────────────

  const openAdd = () => {
    setEditingId(null)
    setFormData(EMPTY_FORM)
    setFieldErrors({})
    setIsDialogOpen(true)
  }

  const openEdit = (m: MeasurementDTO) => {
    setEditingId(m.id)
    setFormData(toForm(m))
    setFieldErrors({})
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setEditingId(null)
    setFormData(EMPTY_FORM)
    setFieldErrors({})
  }

  // ── Save (Create / Update) ─────────────────────────────────────────────────

  const handleSave = async () => {
    if (!validateAll()) return
    setSubmitting(true)
    try {
      const payload = toPayload(formData)
      if (editingId !== null) {
        const updated = await updateMeasurement(editingId, payload)
        setMeasurements((prev) =>
          prev.map((m) => (m.id === editingId ? updated : m))
        )
        showToast("success", "Đã cập nhật bộ số đo!")
      } else {
        const created = await createMeasurement(payload)
        setMeasurements((prev) => [created, ...prev])
        showToast("success", "Đã thêm bộ số đo mới!")
      }
      closeDialog()
    } catch {
      showToast("error", "Đã xảy ra lỗi. Vui lòng thử lại.")
    } finally {
      setSubmitting(false)
    }
  }

  // ── Delete ─────────────────────────────────────────────────────────────────

  const handleDelete = async (id: number) => {
    setDeleting(id)
    try {
      await deleteMeasurement(id)
      setMeasurements((prev) => prev.filter((m) => m.id !== id))
      showToast("success", "Đã xóa bộ số đo.")
    } catch {
      showToast("error", "Không thể xóa bộ số đo. Vui lòng thử lại.")
    } finally {
      setDeleting(null)
      setDeleteConfirmId(null)
    }
  }

  // ── Export / Import JSON ───────────────────────────────────────────────────

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(measurements, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "measurements.json"
    a.click()
    URL.revokeObjectURL(url)
    showToast("success", "Đã xuất file measurements.json")
  }

  const handleImport = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (ev) => {
      try {
        const imported = JSON.parse(ev.target?.result as string)
        if (!Array.isArray(imported)) throw new Error()

        // Import từng bộ số đo lên BE
        let count = 0
        for (const item of imported) {
          if (!item.profileName) continue
          try {
            const created = await createMeasurement({
              profileName: item.profileName,
              height:   item.height   ?? null,
              weight:   item.weight   ?? null,
              bust:     item.bust     ?? null,
              waist:    item.waist    ?? null,
              hips:     item.hips     ?? null,
              shoulder: item.shoulder ?? null,
            })
            setMeasurements((prev) => [created, ...prev])
            count++
          } catch {
            // bỏ qua item lỗi, tiếp tục các item khác
          }
        }
        showToast("success", `Đã nhập ${count} bộ số đo lên server!`)
      } catch {
        showToast("error", "File không hợp lệ. Vui lòng chọn file JSON đúng định dạng.")
      }
    }
    reader.readAsText(file)
    e.target.value = ""
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen flex-col bg-background">

      {/* Toast */}
      {toast && (
        <div
          className={`fixed right-4 top-4 z-50 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg ${
            toast.type === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
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
        <div className="mx-auto max-w-6xl px-4 py-5 md:px-6">
          <nav className="mb-4 text-sm text-gray-500">
            <Link to="/">Trang chủ</Link>
            <span className="mx-2">/</span>
            <Link to="/profile">Thông tin cá nhân</Link>
            <span className="mx-2">/</span>
            <span>Quản lý số đo</span>
          </nav>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">Quản lý số đo</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Lưu và quản lý các bộ số đo cơ thể của bạn
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" className={btnOutline} onClick={handleExport} disabled={measurements.length === 0}>
                <Download className="mr-2 h-4 w-4" />
                Xuất JSON
              </button>
              <label className="cursor-pointer">
                <span className={btnOutline}>
                  <Upload className="mr-2 h-4 w-4" />
                  Nhập JSON
                </span>
                <input
                  id="import-json"
                  type="file"
                  accept=".json"
                  className="sr-only"
                  onChange={handleImport}
                />
              </label>
              <button type="button" className={btnPrimary} onClick={openAdd}>
                <Plus className="mr-2 h-4 w-4" />
                Thêm số đo
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">

          {/* Error */}
          {error && (
            <div className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
              <button
                onClick={fetchMeasurements}
                className="ml-4 rounded-md border border-red-200 px-3 py-1 text-xs font-medium hover:bg-red-100"
              >
                Thử lại
              </button>
            </div>
          )}

          {/* Loading skeleton */}
          {loading && <MeasurementSkeleton />}

          {/* Empty state */}
          {!loading && !error && measurements.length === 0 && (
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                  <Ruler className="h-10 w-10 text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Chưa có số đo nào</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Thêm bộ số đo đầu tiên để sử dụng khi đặt may cosplay
                </p>
                <button type="button" className={`mt-6 ${btnPrimary}`} onClick={openAdd}>
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm số đo
                </button>
              </div>
            </div>
          )}

          {/* Measurement cards */}
          {!loading && !error && measurements.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {measurements.map((m) => (
                <div
                  key={m.id}
                  className="rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
                >
                  {/* Card header */}
                  <div className="border-b px-5 py-4">
                    <h3 className="font-semibold text-gray-900">{m.profileName}</h3>
                    <p className="mt-0.5 text-xs text-gray-400">
                      Cập nhật: {formatDate(m.updatedAt)}
                    </p>
                  </div>

                  {/* Measurements grid */}
                  <div className="px-5 py-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {measurementFields.map((field) => {
                        const val = m[field.key as keyof MeasurementDTO] as number | null
                        if (val == null) return null
                        return (
                          <div key={field.key}>
                            <p className="text-xs text-gray-400">{field.label}</p>
                            <p className="font-semibold text-gray-800">
                              {val}{" "}
                              <span className="text-xs font-normal text-gray-400">
                                {field.unit}
                              </span>
                            </p>
                          </div>
                        )
                      })}
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex items-center gap-2">
                      <button
                        type="button"
                        className={`flex-1 ${btnOutline}`}
                        onClick={() => openEdit(m)}
                      >
                        <Edit3 className="mr-2 h-3.5 w-3.5" />
                        Sửa
                      </button>
                      <button
                        type="button"
                        className={`${btnIcon} text-red-400 hover:border-red-200 hover:bg-red-50`}
                        title="Xóa"
                        onClick={() => setDeleteConfirmId(m.id)}
                        disabled={deleting === m.id}
                      >
                        {deleting === m.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tips */}
          <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50">
            <div className="flex items-start gap-3 p-4">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
              <div className="text-sm">
                <p className="font-semibold text-blue-800">Cách đo chính xác</p>
                <ul className="mt-2 space-y-1 text-blue-700/80">
                  <li>• Đo khi mặc đồ lót mỏng</li>
                  <li>• Thước dây không quá chặt hoặc lỏng</li>
                  <li>• Đứng thẳng, thả lỏng tự nhiên</li>
                  <li>• Nhờ người khác đo để chính xác hơn</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ──── Add / Edit Dialog ──────────────────────────────────────────────── */}
      {isDialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={closeDialog}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Dialog header */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h2 className="text-lg font-bold">
                  {editingId !== null ? "Chỉnh sửa số đo" : "Thêm số đo mới"}
                </h2>
                <p className="mt-0.5 text-sm text-gray-500">
                  Nhập thông tin số đo cơ thể của bạn
                </p>
              </div>
              <button
                onClick={closeDialog}
                className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 px-6 py-5">
              {/* Tên bộ số đo */}
              <div className="space-y-1.5">
                <label htmlFor="m-profileName" className="text-sm font-medium text-gray-700">
                  Tên bộ số đo <span className="text-red-500">*</span>
                </label>
                <input
                  id="m-profileName"
                  type="text"
                  className={fieldErrors.profileName ? inputError : inputNormal}
                  value={formData.profileName}
                  onChange={(e) => handleFieldChange("profileName", e.target.value)}
                  placeholder="VD: Số đo mặc định"
                />
                {fieldErrors.profileName && (
                  <p className="text-xs text-red-500">{fieldErrors.profileName}</p>
                )}
              </div>

              {/* Các trường số đo */}
              <div className="grid grid-cols-2 gap-4">
                {measurementFields.map((field) => (
                  <div key={field.key} className="space-y-1.5">
                    <label
                      htmlFor={`m-${field.key}`}
                      className="text-sm font-medium text-gray-700"
                    >
                      {field.label}
                      <span className="ml-1 text-xs font-normal text-gray-400">
                        ({field.unit})
                      </span>
                    </label>
                    <input
                      id={`m-${field.key}`}
                      type="number"
                      min={field.min}
                      max={field.max}
                      step="0.01"
                      className={fieldErrors[field.key] ? inputError : inputNormal}
                      value={formData[field.key]}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                    />
                    {fieldErrors[field.key] && (
                      <p className="text-xs text-red-500">{fieldErrors[field.key]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Dialog footer */}
            <div className="flex justify-end gap-2 border-t px-6 py-4">
              <button
                type="button"
                className={btnGhost}
                onClick={closeDialog}
                disabled={submitting}
              >
                Hủy
              </button>
              <button
                type="button"
                className={btnPrimary}
                onClick={handleSave}
                disabled={submitting || !formData.profileName.trim()}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : editingId !== null ? (
                  "Cập nhật"
                ) : (
                  "Thêm mới"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ──── Delete Confirm Dialog ──────────────────────────────────────────── */}
      {deleteConfirmId !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setDeleteConfirmId(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 pt-6 pb-4">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <Trash2 className="h-6 w-6 text-red-500" />
              </div>
              <h2 className="text-base font-bold text-gray-900">Xóa số đo này?</h2>
              <p className="mt-2 text-sm text-gray-500">
                Bộ số đo sẽ bị xóa vĩnh viễn khỏi hệ thống và không thể hoàn tác.
              </p>
            </div>
            <div className="flex justify-end gap-2 border-t px-6 py-4">
              <button
                type="button"
                className={btnOutline}
                onClick={() => setDeleteConfirmId(null)}
                disabled={deleting !== null}
              >
                Hủy
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600 disabled:opacity-50"
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={deleting !== null}
              >
                {deleting !== null ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xóa...
                  </>
                ) : (
                  "Xóa"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
