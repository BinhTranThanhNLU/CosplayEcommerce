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
  Package,
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
    title: "Quản lý đơn hàng",
    icon: ShoppingCart,
    path: "/admin/orders",
  },
  {
    title: "Quản lý sản phẩm",
    icon: Package,
    path: "/admin/products",
  },
  {
    title: "Quản lý cửa hàng",
    icon: Store,
    path: "/admin/shops",
  },
  {
    title: "Quản lý doanh thu",
    icon: DollarSign,
    path: "/admin/revenue",
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
              (item.path !== "/admin" && pathname.startsWith(item.path));

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
