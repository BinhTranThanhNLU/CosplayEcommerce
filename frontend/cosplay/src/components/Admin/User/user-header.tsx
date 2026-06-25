import { UserPlus } from "lucide-react";

type Props = {
    onAddUser: () => void;
};

export default function UserHeader({ onAddUser }: Props) {
    return (
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
                <h1 className="text-2xl font-black text-slate-900">Quản lý Người dùng</h1>
                <p className="text-sm text-slate-500">
                    Xem danh sách, phân quyền và trạng thái hoạt động của thành viên.
                </p>
            </div>
            <button
                onClick={onAddUser}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700"
            >
                <UserPlus size={16} />
                Thêm User mới
            </button>
        </div>
    );
}
