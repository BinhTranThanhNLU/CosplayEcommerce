import { useState, useEffect, useCallback } from "react";
import {
  Search,
  PackagePlus,
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Package,
  ShoppingBag,
  Scissors,
  Box,
} from "lucide-react";
import axios from "axios";

// ─── TYPES ──────────────────────────────────────────────────────────────────
type AdminProductDTO = {
  id: number;
  name: string;
  imageUrl: string;
  type: string;
  shopName: string;
  categoryName: string;
  createdAt: string;
};

type ProductStats = {
  totalProducts: number;
  sellProducts: number;
  rentProducts: number;
  customProducts: number;
};

const PAGE_SIZE = 10;

// ─── CONFIGS ────────────────────────────────────────────────────────────────
const TYPE_STYLE: Record<string, string> = {
  SELL: "border-blue-100 bg-blue-50 text-blue-600",
  RENT: "border-emerald-100 bg-emerald-50 text-emerald-600",
  CUSTOM_MADE: "border-purple-100 bg-purple-50 text-purple-600",
};

const TYPE_LABEL: Record<string, string> = {
  SELL: "Bán",
  RENT: "Cho thuê",
  CUSTOM_MADE: "May đo",
};

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────
export default function AdminProductsPage() {
  // State Filters
  const [keyword, setKeyword] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [page, setPage] = useState(0);

  // State Data
  const [products, setProducts] = useState<AdminProductDTO[]>([]);
  const [stats, setStats] = useState<ProductStats | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  // Lấy Token từ LocalStorage để gọi API Admin
  const token = localStorage.getItem("token");
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  // Fetch Stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/admin/products/stats",
        axiosConfig,
      );
      setStats(res.data);
    } catch (error) {
      console.error("Lỗi tải thống kê", error);
    }
  }, []);

  // Fetch Table Data
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/admin/products`, {
        ...axiosConfig,
        params: {
          keyword: keyword || undefined,
          type: filterType,
          page: page,
          size: PAGE_SIZE,
        },
      });
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
      setTotalItems(res.data.totalItems);
    } catch (error) {
      console.error("Lỗi tải danh sách sản phẩm", error);
    } finally {
      setLoading(false);
    }
  }, [keyword, filterType, page]);

  // Reset page về 0 khi đổi filter
  useEffect(() => {
    setPage(0);
  }, [keyword, filterType]);

  // Fetch dữ liệu khi mount hoặc khi dependencies đổi
  useEffect(() => {
    fetchStats();
    fetchProducts();
  }, [fetchStats, fetchProducts]);

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 p-6">
      {/* 1. HEADER */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            Quản lý Sản phẩm
          </h1>
          <p className="text-sm text-slate-500">
            Xem danh sách, phân loại và quản lý toàn bộ sản phẩm trên hệ thống.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700">
          <PackagePlus size={16} />
          Thêm Sản phẩm
        </button>
      </div>

      {/* 2. STATS */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <StatCard
          label="Tổng sản phẩm"
          value={stats?.totalProducts}
          icon={Box}
          color="indigo"
        />
        <StatCard
          label="Sản phẩm Bán"
          value={stats?.sellProducts}
          icon={ShoppingBag}
          color="blue"
        />
        <StatCard
          label="Sản phẩm Thuê"
          value={stats?.rentProducts}
          icon={Package}
          color="emerald"
        />
        <StatCard
          label="Đồ May Đo"
          value={stats?.customProducts}
          icon={Scissors}
          color="purple"
        />
      </div>

      {/* 3. FILTERS */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
        <div className="relative flex-1 min-w-[250px]">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm theo tên sản phẩm..."
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div className="flex rounded-xl bg-slate-100 p-1">
          {[
            { value: "all", label: "Tất cả" },
            { value: "SELL", label: "Bán" },
            { value: "RENT", label: "Cho thuê" },
            { value: "CUSTOM_MADE", label: "May đo" },
          ].map((t) => (
            <button
              key={t.value}
              onClick={() => setFilterType(t.value)}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold transition ${
                filterType === t.value
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. TABLE */}
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-slate-900">
              Danh sách sản phẩm
            </p>
            <p className="text-xs text-slate-500">
              {totalItems.toLocaleString("vi-VN")} sản phẩm
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/60">
                <th className="px-6 py-4 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                  Sản phẩm
                </th>
                <th className="px-6 py-4 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                  Cửa hàng
                </th>
                <th className="px-6 py-4 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                  Danh mục
                </th>
                <th className="px-6 py-4 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                  Loại
                </th>
                <th className="px-6 py-4 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                  Ngày tạo
                </th>
                <th className="px-6 py-4 text-right text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-16 text-center text-sm text-slate-400"
                  >
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-16 text-center text-sm text-slate-400"
                  >
                    Không tìm thấy sản phẩm nào.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr
                    key={p.id}
                    className="group transition-colors hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="h-12 w-12 rounded-lg object-cover border border-slate-100"
                        />
                        <p className="text-sm font-bold text-slate-900 line-clamp-2 max-w-[200px]">
                          {p.name}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-700">
                      {p.shopName}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {p.categoryName}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-lg border px-2.5 py-1 text-[10px] font-black tracking-wide uppercase ${TYPE_STYLE[p.type] ?? "border-slate-100 bg-slate-50 text-slate-600"}`}
                      >
                        {TYPE_LABEL[p.type] ?? p.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(p.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 transition group-hover:opacity-100">
                        <button
                          title="Xem"
                          className="rounded-lg p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          title="Sửa"
                          className="rounded-lg p-2 text-slate-400 hover:bg-amber-50 hover:text-amber-600"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          title="Xóa"
                          className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. PAGINATION */}
      {totalPages > 1 && (
        <div className="flex flex-col gap-2 px-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-400">
            Hiển thị {page * PAGE_SIZE + 1}–
            {Math.min((page + 1) * PAGE_SIZE, totalItems)} / {totalItems} sản
            phẩm
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40 hover:bg-slate-50"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setPage(idx)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition ${
                  page === idx
                    ? "bg-indigo-600 text-white shadow"
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages - 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40 hover:bg-slate-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-component nội bộ giúp render Card thống kê cho gọn code
function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value?: number;
  icon: any;
  color: string;
}) {
  const colorStyles: Record<string, string> = {
    indigo: "bg-indigo-50 text-indigo-600",
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="flex items-center gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${colorStyles[color]}`}
      >
        <Icon size={24} />
      </div>
      <div>
        <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">
          {label}
        </p>
        <p className="text-2xl font-black text-slate-900">
          {value !== undefined ? value.toLocaleString("vi-VN") : "..."}
        </p>
      </div>
    </div>
  );
}
