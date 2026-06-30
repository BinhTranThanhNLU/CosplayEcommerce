import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Store,
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users,
  Package,
  MapPin,
} from "lucide-react";
import axios from "axios";

// ─── TYPES ──────────────────────────────────────────────────────────────────
type AdminShopDTO = {
  id: number;
  shopName: string;
  description: string;
  sellerName: string;
  sellerEmail: string;
  productCount: number;
  createdAt: string;
};

type ShopStats = {
  totalShops: number;
  totalSellers: number;
};

const PAGE_SIZE = 10;

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────
export default function AdminShopsPage() {
  // State Filters
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);

  // State Data
  const [shops, setShops] = useState<AdminShopDTO[]>([]);
  const [stats, setStats] = useState<ShopStats | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  // Lấy Token từ LocalStorage
  const token = localStorage.getItem("token");
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  // Fetch Stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/admin/shops/stats",
        axiosConfig,
      );
      setStats(res.data);
    } catch (error) {
      console.error("Lỗi tải thống kê shop", error);
    }
  }, []);

  // Fetch Table Data
  const fetchShops = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/admin/shops`, {
        ...axiosConfig,
        params: {
          keyword: keyword || undefined,
          page: page,
          size: PAGE_SIZE,
        },
      });
      setShops(res.data.shops);
      setTotalPages(res.data.totalPages);
      setTotalItems(res.data.totalItems);
    } catch (error) {
      console.error("Lỗi tải danh sách cửa hàng", error);
    } finally {
      setLoading(false);
    }
  }, [keyword, page]);

  // Reset page về 0 khi đổi từ khóa tìm kiếm
  useEffect(() => {
    setPage(0);
  }, [keyword]);

  // Fetch dữ liệu khi mount
  useEffect(() => {
    fetchStats();
    fetchShops();
  }, [fetchStats, fetchShops]);

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 p-6">
      {/* 1. HEADER */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            Quản lý Cửa hàng
          </h1>
          <p className="text-sm text-slate-500">
            Theo dõi hoạt động kinh doanh, sản phẩm của các Seller trên hệ
            thống.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700">
          <Store size={16} />
          Thêm Cửa hàng mới
        </button>
      </div>

      {/* 2. STATS */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <StatCard
          label="Tổng số cửa hàng"
          value={stats?.totalShops}
          icon={Store}
          color="indigo"
        />
        <StatCard
          label="Tổng số Seller"
          value={stats?.totalSellers}
          icon={Users}
          color="emerald"
        />
      </div>

      {/* 3. FILTERS */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm theo tên shop, tên chủ shop hoặc email..."
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      </div>

      {/* 4. TABLE */}
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-slate-900">
              Danh sách Cửa hàng
            </p>
            <p className="text-xs text-slate-500">
              {totalItems.toLocaleString("vi-VN")} cửa hàng
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/60">
                <th className="px-6 py-4 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                  Cửa hàng
                </th>
                <th className="px-6 py-4 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                  Chủ shop (Seller)
                </th>
                <th className="px-6 py-4 text-[11px] font-bold tracking-wider text-slate-400 uppercase text-center">
                  Số SP
                </th>
                <th className="px-6 py-4 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                  Ngày đăng ký
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
                    colSpan={5}
                    className="py-16 text-center text-sm text-slate-400"
                  >
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : shops.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-16 text-center text-sm text-slate-400"
                  >
                    Không tìm thấy cửa hàng nào.
                  </td>
                </tr>
              ) : (
                shops.map((s) => (
                  <tr
                    key={s.id}
                    className="group transition-colors hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                          <Store size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {s.shopName}
                          </p>
                          <p className="text-xs text-slate-500 line-clamp-1 max-w-[200px]">
                            {s.description || "Chưa có mô tả"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-700">
                        {s.sellerName}
                      </p>
                      <p className="text-xs text-slate-400">{s.sellerEmail}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                        <Package size={12} />
                        {s.productCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(s.createdAt).toLocaleDateString("vi-VN")}
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
            {Math.min((page + 1) * PAGE_SIZE, totalItems)} / {totalItems} cửa
            hàng
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

// Sub-component nội bộ giúp render Card thống kê
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
    emerald: "bg-emerald-50 text-emerald-600",
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
