import { Bell } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 h-16 border-b bg-white shadow-sm">
      <div className="flex h-full items-center justify-between px-6">
        <Link
          to="/admin"
          className="flex items-center gap-2"
        >
          <span className="text-xl font-extrabold text-indigo-600">
            cosplay
          </span>

          <span className="text-xl font-extrabold">
            .vn
          </span>

          <span className="ml-2 text-xs font-semibold text-slate-500">
            ADMIN
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <button className="relative rounded-lg p-2 hover:bg-slate-100">
            <Bell size={20} />

            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              5
            </span>
          </button>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 font-bold text-white">
            AD
          </div>
        </div>
      </div>
    </header>
  );
}