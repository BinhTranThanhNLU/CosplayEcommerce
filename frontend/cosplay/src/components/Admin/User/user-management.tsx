import { useEffect, useState, useCallback } from "react";
import type { UserDTO } from "../../../model/AuthModel";
import {
    getUsers,
    getUserStats,
    changeUserStatus,
    deleteUser,
    type UserStatsResponse,
} from "../../../apis/userApi";

import UserHeader from "./user-header";
import UserStats from "./user-stats";
import UserFilters from "./user-filters";
import UserTable from "./user-table";
import UserPagination from "./user-pagination";
import UserViewModal from "./user-view-modal";
import UserEditModal from "./user-edit-modal";
import UserConfirmModal from "./user-confirm-modal";
import UserCreateModal from "./user-create-modal";

const PAGE_SIZE = 10;

type ModalState =
    | { type: "none" }
    | { type: "create" }
    | { type: "view"; user: UserDTO }
    | { type: "edit"; user: UserDTO }
    | { type: "ban"; user: UserDTO }
    | { type: "delete"; user: UserDTO };

export default function UserManagement() {
    // ─── Filter state ───────────────────────────────────────────────────────────
    const [keyword, setKeyword] = useState("");
    const [filterRole, setFilterRole] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [page, setPage] = useState(0);

    // ─── Data state ─────────────────────────────────────────────────────────────
    const [users, setUsers] = useState<UserDTO[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [stats, setStats] = useState<UserStatsResponse | null>(null);
    const [loadingList, setLoadingList] = useState(false);
    const [loadingStats, setLoadingStats] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState("");

    // ─── Modal state ────────────────────────────────────────────────────────────
    const [modal, setModal] = useState<ModalState>({ type: "none" });

    // ─── Fetch users ─────────────────────────────────────────────────────────────
    const fetchUsers = useCallback(async () => {
        setLoadingList(true);
        try {
            const res = await getUsers({
                keyword: keyword || undefined,
                role: filterRole !== "all" ? filterRole : undefined,
                status: filterStatus !== "all" ? filterStatus : undefined,
                page,
                size: PAGE_SIZE,
            });
            setUsers(res.users);
            setTotalPages(res.totalPages);
            setTotalItems(res.totalItems);
        } catch {
            // Giữ dữ liệu cũ nếu lỗi
        } finally {
            setLoadingList(false);
        }
    }, [keyword, filterRole, filterStatus, page]);

    // ─── Fetch stats ─────────────────────────────────────────────────────────────
    const fetchStats = useCallback(async () => {
        setLoadingStats(true);
        try {
            const res = await getUserStats();
            setStats(res);
        } catch {
            // ignore
        } finally {
            setLoadingStats(false);
        }
    }, []);

    // Reset page về 0 khi filter thay đổi
    useEffect(() => {
        setPage(0);
    }, [keyword, filterRole, filterStatus]);

    // Fetch users khi page/filter thay đổi
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Fetch stats một lần khi mount
    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    // ─── Handlers ────────────────────────────────────────────────────────────────

    const handleToggleBan = async () => {
        if (modal.type !== "ban") return;
        const user = modal.user;
        setActionLoading(true);
        setActionError("");
        try {
            const newStatus = user.status === "BANNED" ? "ACTIVE" : "BANNED";
            const updated = await changeUserStatus(user.id, newStatus);
            setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
            await fetchStats();
            setModal({ type: "none" });
        } catch (err: unknown) {
            const msg =
                (err as { response?: { data?: { message?: string } } })
                    ?.response?.data?.message ?? "Thao tác thất bại. Vui lòng thử lại.";
            setActionError(msg);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (modal.type !== "delete") return;
        const user = modal.user;
        setActionLoading(true);
        setActionError("");
        try {
            await deleteUser(user.id);
            await Promise.all([fetchUsers(), fetchStats()]);
            setModal({ type: "none" });
        } catch (err: unknown) {
            const msg =
                (err as { response?: { data?: { message?: string } } })
                    ?.response?.data?.message ?? "Xóa tài khoản thất bại. Vui lòng thử lại.";
            setActionError(msg);
        } finally {
            setActionLoading(false);
        }
    };

    const handleEditSaved = (updated: UserDTO) => {
        setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
        setModal({ type: "none" });
    };

    const handleCreated = async (newUser: UserDTO) => {
        setModal({ type: "none" });
        // Refresh về trang đầu để thấy user mới
        setPage(0);
        await Promise.all([fetchUsers(), fetchStats()]);
        // Nếu đang ở trang 0 thì fetchUsers đã chạy; nếu không thì setPage(0) trigger useEffect
        // Hiển thị user mới ở đầu bằng cách prepend tạm thời
        setUsers((prev) => [newUser, ...prev.slice(0, PAGE_SIZE - 1)]);
    };

    // ─── Render ──────────────────────────────────────────────────────────────────
    return (
        <div className="mx-auto max-w-[1600px] space-y-6">
            <UserHeader onAddUser={() => setModal({ type: "create" })} />

            <UserStats stats={stats} loading={loadingStats} />

            <UserFilters
                keyword={keyword}
                setKeyword={setKeyword}
                filterRole={filterRole}
                setFilterRole={setFilterRole}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
            />

            <UserTable
                users={users}
                totalItems={totalItems}
                loading={loadingList}
                onView={(user) => setModal({ type: "view", user })}
                onEdit={(user) => setModal({ type: "edit", user })}
                onToggleBan={(user) => setModal({ type: "ban", user })}
                onDelete={(user) => setModal({ type: "delete", user })}
            />

            <UserPagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={totalItems}
                pageSize={PAGE_SIZE}
                onPageChange={setPage}
            />

            {/* Modals */}
            {modal.type === "create" && (
                <UserCreateModal
                    onClose={() => setModal({ type: "none" })}
                    onCreated={handleCreated}
                />
            )}

            {modal.type === "view" && (
                <UserViewModal user={modal.user} onClose={() => setModal({ type: "none" })} />
            )}

            {modal.type === "edit" && (
                <UserEditModal
                    user={modal.user}
                    onClose={() => setModal({ type: "none" })}
                    onSaved={handleEditSaved}
                />
            )}

            {modal.type === "ban" && (
                <UserConfirmModal
                    title={modal.user.status === "BANNED" ? "Mở khóa tài khoản?" : "Khóa tài khoản?"}
                    message={
                        modal.user.status === "BANNED"
                            ? `Mở khóa tài khoản của "${modal.user.fullName || modal.user.email}"?`
                            : `Tài khoản "${modal.user.fullName || modal.user.email}" sẽ không thể đăng nhập.`
                    }
                    confirmLabel={modal.user.status === "BANNED" ? "Mở khóa" : "Khóa tài khoản"}
                    confirmDanger={modal.user.status !== "BANNED"}
                    loading={actionLoading}
                    error={actionError}
                    onConfirm={handleToggleBan}
                    onCancel={() => { setModal({ type: "none" }); setActionError(""); }}
                />
            )}

            {modal.type === "delete" && (
                <UserConfirmModal
                    title="Xóa người dùng?"
                    message={`Hành động này không thể hoàn tác. Xóa tài khoản "${modal.user.fullName || modal.user.email}"?`}
                    confirmLabel="Xóa vĩnh viễn"
                    confirmDanger
                    loading={actionLoading}
                    error={actionError}
                    onConfirm={handleDelete}
                    onCancel={() => { setModal({ type: "none" }); setActionError(""); }}
                />
            )}
        </div>
    );
}
