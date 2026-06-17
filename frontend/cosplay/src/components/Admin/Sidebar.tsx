import {
  LayoutDashboard,
  Users,
  Store,
  ShoppingCart,
  Receipt,
  Grid,
  Percent,
  DollarSign,
  BarChart3,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";

const menus = [
  {
    title: "Tổng quan",
    icon: LayoutDashboard,
    path: "/admin",
  },
  {
    title: "Quản lý User",
    icon: Users,
    path: "/admin/users",
  },
  {
    title: "Quản lý Seller",
    icon: Store,
    path: "/admin/sellers",
  },
  {
    title: "Quản lý đơn hàng",
    icon: ShoppingCart,
    path: "/admin/orders",
  },
  {
    title: "Quản lý hóa đơn",
    icon: Receipt,
    path: "/admin/invoices",
  },
  {
    title: "Quản lý danh mục",
    icon: Grid,
    path: "/admin/categories",
  },
  {
    title: "Quản lý phí sàn",
    icon: Percent,
    path: "/admin/fees",
  },
  {
    title: "Quản lý doanh thu",
    icon: DollarSign,
    path: "/admin/revenue",
  },
  {
    title: "Thống kê",
    icon: BarChart3,
    path: "/admin/stats",
  },
];

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="hidden w-64 border-r bg-white lg:block">
      <div className="sticky top-16 p-4">
        <nav className="space-y-2">
          {menus.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.path ||
              (item.path !== "/admin" &&
                pathname.startsWith(item.path));

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                  active
                    ? "bg-indigo-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon size={18} />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}