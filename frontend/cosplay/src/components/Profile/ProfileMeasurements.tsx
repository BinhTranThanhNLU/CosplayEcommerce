import { useState, useEffect, type ChangeEvent } from "react"
import { Link } from "react-router-dom"
import {
  Ruler,
  Plus,
  Edit3,
  Trash2,
  Star,
  Download,
  Upload,
  Info,
} from "lucide-react"

type Measurement = {
  id: string
  name: string
  date: string
  isDefault: boolean
  height: string
  weight: string
  bust: string
  waist: string
  hips: string
  shoulder: string
  armLength: string
  legLength: string
}

type MeasurementFormData = Omit<Measurement, "id" | "date" | "isDefault">

const STORAGE_KEY = "measurements"

const EMPTY_FORM_DATA: MeasurementFormData = {
  name: "",
  height: "",
  weight: "",
  bust: "",
  waist: "",
  hips: "",
  shoulder: "",
  armLength: "",
  legLength: "",
}

const measurementFields: {
  key: keyof MeasurementFormData
  label: string
  unit: string
  placeholder: string
}[] = [
  { key: "height", label: "Chiều cao", unit: "cm", placeholder: "168" },
  { key: "weight", label: "Cân nặng", unit: "kg", placeholder: "55" },
  { key: "bust", label: "Vòng ngực", unit: "cm", placeholder: "86" },
  { key: "waist", label: "Vòng eo", unit: "cm", placeholder: "68" },
  { key: "hips", label: "Vòng mông", unit: "cm", placeholder: "90" },
  { key: "shoulder", label: "Vai rộng", unit: "cm", placeholder: "38" },
  { key: "armLength", label: "Dài tay", unit: "cm", placeholder: "58" },
  { key: "legLength", label: "Dài quần", unit: "cm", placeholder: "100" },
]

const loadMeasurements = (): Measurement[] => {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch (e) {
      console.error("Failed to load measurements:", e)
    }
  }
  return []
}

const btnPrimary =
  "inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
const btnOutline =
  "inline-flex items-center justify-center rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium transition hover:bg-muted"
const btnGhost =
  "inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition hover:bg-muted"
const btnIcon =
  "inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background transition hover:bg-muted"
const inputClass =
  "h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"

export function ProfileMeasurements() {
  const [measurements, setMeasurements] =
    useState<Measurement[]>(loadMeasurements)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [formData, setFormData] = useState<MeasurementFormData>(EMPTY_FORM_DATA)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(measurements))
  }, [measurements])

  const resetForm = () => {
    setEditingId(null)
    setFormData(EMPTY_FORM_DATA)
    setIsDialogOpen(false)
  }

  const handleSave = () => {
    if (!formData.name.trim()) return

    const newId = editingId || crypto.randomUUID()
    const measurement: Measurement = {
      id: newId,
      name: formData.name,
      date: new Date().toISOString(),
      isDefault: measurements.length === 0,
      height: formData.height || "",
      weight: formData.weight || "",
      bust: formData.bust || "",
      waist: formData.waist || "",
      hips: formData.hips || "",
      shoulder: formData.shoulder || "",
      armLength: formData.armLength || "",
      legLength: formData.legLength || "",
    }

    if (editingId) {
      setMeasurements((prev) =>
        prev.map((m) => (m.id === editingId ? measurement : m))
      )
    } else {
      setMeasurements((prev) => [measurement, ...prev])
    }

    resetForm()
  }

  const handleEdit = (measurement: Measurement) => {
    setEditingId(measurement.id)
    setFormData({
      name: measurement.name,
      height: measurement.height,
      weight: measurement.weight,
      bust: measurement.bust,
      waist: measurement.waist,
      hips: measurement.hips,
      shoulder: measurement.shoulder,
      armLength: measurement.armLength,
      legLength: measurement.legLength,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setMeasurements((prev) => prev.filter((m) => m.id !== id))
    setDeleteConfirmId(null)
  }

  const handleSetDefault = (id: string) => {
    setMeasurements((prev) =>
      prev.map((m) => ({ ...m, isDefault: m.id === id }))
    )
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(measurements, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "measurements.json"
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string)
        if (Array.isArray(imported)) {
          setMeasurements((prev) => [...imported, ...prev])
        }
      } catch {
        alert("File không hợp lệ")
      }
    }
    reader.readAsText(file)
  }

  const openAddDialog = () => {
    setEditingId(null)
    setFormData(EMPTY_FORM_DATA)
    setIsDialogOpen(true)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="border-b border-border/60 bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-5 md:px-6">
          <nav className="mb-4 text-sm text-gray-500">
            <Link to="/">Trang chủ</Link>
            <span className="mx-2">/</span>
            <Link to="/profile">Thông tin cá nhân</Link>
            <span className="mx-2">/</span>
            <span>Quản lý số đo</span>
          </nav>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">
                Quản lý số đo
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Lưu và quản lý các bộ số đo cơ thể của bạn
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className={btnOutline}
                onClick={handleExport}
              >
                <Download className="mr-2 h-4 w-4" />
                Xuất
              </button>
              <label className="cursor-pointer">
                <span className={btnOutline}>
                  <Upload className="mr-2 h-4 w-4" />
                  Nhập
                </span>
                <input
                  id="import"
                  type="file"
                  accept=".json"
                  className="sr-only"
                  onChange={handleImport}
                />
              </label>
              <button type="button" className={btnPrimary} onClick={openAddDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Thêm số đo
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
          {measurements.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Ruler className="mb-4 h-12 w-12 text-muted-foreground/30" />
                <h3 className="text-lg font-semibold">Chưa có số đo nào</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Thêm bộ số đo đầu tiên để sử dụng khi đặt may
                </p>
                <button
                  type="button"
                  className={`mt-4 ${btnPrimary}`}
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm số đo
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {measurements.map((measurement) => (
                <div
                  key={measurement.id}
                  className={`rounded-xl border border-gray-200 bg-white shadow-sm transition-all ${
                    measurement.isDefault ? "border-primary/50 shadow-md" : ""
                  }`}
                >
                  <div className="border-b p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-base font-semibold">
                          {measurement.name}
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {new Date(measurement.date).toLocaleDateString(
                            "vi-VN"
                          )}
                        </p>
                      </div>
                      {measurement.isDefault && (
                        <span
                          className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium"
                        >
                          <Star className="h-3 w-3 fill-primary text-primary" />
                          Mặc định
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-4 p-5">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {measurementFields.map((field) => {
                        const value = measurement[field.key]
                        if (!value) return null
                        return (
                          <div key={field.key}>
                            <p className="text-xs text-muted-foreground">
                              {field.label}
                            </p>
                            <p className="font-medium">
                              {value} {field.unit}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className={`flex-1 ${btnOutline}`}
                        onClick={() => handleEdit(measurement)}
                      >
                        <Edit3 className="mr-2 h-3.5 w-3.5" />
                        Sửa
                      </button>
                      {!measurement.isDefault && (
                        <button
                          type="button"
                          className={btnIcon}
                          title="Đặt làm mặc định"
                          onClick={() => handleSetDefault(measurement.id)}
                        >
                          <Star className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        className={`${btnIcon} text-destructive hover:bg-destructive/10`}
                        onClick={() => setDeleteConfirmId(measurement.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5">
            <div className="flex items-start gap-3 p-4">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div className="text-sm">
                <p className="font-semibold text-foreground">
                  Cách đo chính xác
                </p>
                <ul className="mt-2 space-y-1 text-muted-foreground">
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

      {isDialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setIsDialogOpen(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b px-6 py-4">
              <h2 className="text-lg font-semibold">
                {editingId ? "Chỉnh sửa số đo" : "Thêm số đo mới"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Nhập thông tin số đo cơ thể của bạn
              </p>
            </div>
            <div className="space-y-4 px-6 py-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Tên bộ số đo{" "}
                  <span className="text-destructive">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  className={inputClass}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="VD: Số đo mặc định"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {measurementFields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <label htmlFor={field.key} className="text-sm font-medium">
                      {field.label}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        id={field.key}
                        type="number"
                        className={inputClass}
                        value={formData[field.key]}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            [field.key]: e.target.value,
                          }))
                        }
                        placeholder={field.placeholder}
                      />
                      <span className="text-sm text-muted-foreground">
                        {field.unit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t px-6 py-4">
              <button type="button" className={btnGhost} onClick={resetForm}>
                Hủy
              </button>
              <button
                type="button"
                className={btnPrimary}
                onClick={handleSave}
                disabled={!formData.name.trim()}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirmId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setDeleteConfirmId(null)}
        >
          <div
            className="w-full max-w-sm rounded-xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 pt-6 pb-4">
              <h2 className="text-base font-semibold">Xóa số đo này?</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Bạn không thể hoàn tác hành động này. Số đo sẽ bị xóa vĩnh
                viễn.
              </p>
            </div>
            <div className="flex justify-end gap-2 border-t px-6 py-4">
              <button
                type="button"
                className={btnOutline}
                onClick={() => setDeleteConfirmId(null)}
              >
                Hủy
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md bg-destructive px-3 py-1.5 text-sm font-medium text-white transition hover:opacity-90"
                onClick={() => handleDelete(deleteConfirmId)}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
