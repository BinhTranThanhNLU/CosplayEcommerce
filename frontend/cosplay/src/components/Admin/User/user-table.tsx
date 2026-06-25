import type { UserDTO } from "../../../model/AuthModel";
import UserRow from "./user-row";

type Props = {
    users: UserDTO[];
    totalItems: number;
    loading: boolean;
    onView: (user: UserDTO) => void;
    onEdit: (user: UserDTO) => void;
    onToggleBan: (user: UserDTO) => void;
    onDelete: (user: UserDTO) => void;
};

export default function UserTable({ users, totalItems, loading, onView, onEdit, onToggleBan, onDelete }: Props) {
    return (
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-6">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-900">Danh sách người dùng</p>
                    <p className="text-xs text-slate-500">{totalItems.toLocaleString("vi-VN")} người dùng</p>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/60">
                            <th className="px-6 py-4 text-[11px] font-bold tracking-wider text-slate-400 uppercase">Người dùng</th>
                            <th className="px-6 py-4 text-[11px] font-bold tracking-wider text-slate-400 uppercase">Vai trò</th>
                            <th className="px-6 py-4 text-[11px] font-bold tracking-wider text-slate-400 uppercase">Trạng thái</th>
                            <th className="px-6 py-4 text-[11px] font-bold tracking-wider text-slate-400 uppercase">Điện thoại</th>
                            <th className="px-6 py-4 text-[11px] font-bold tracking-wider text-slate-400 uppercase">Ngày tham gia</th>
                            <th className="px-6 py-4 text-right text-[11px] font-bold tracking-wider text-slate-400 uppercase">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="py-16 text-center text-sm text-slate-400">
                                    Đang tải...
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-16 text-center text-sm text-slate-400">
                                    Không tìm thấy người dùng nào.
                                </td>
                            </tr>
                        ) : (
                            users.map((u) => (
                                <UserRow
                                    key={u.id}
                                    user={u}
                                    onView={onView}
                                    onEdit={onEdit}
                                    onToggleBan={onToggleBan}
                                    onDelete={onDelete}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
