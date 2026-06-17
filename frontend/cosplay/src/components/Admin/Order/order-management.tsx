import { useEffect, useState, useCallback } from "react";
import type { OrderDTO, OrderStatsResponse } from "../../../apis/orderApi";
import { getOrders, getOrderStats } from "../../../apis/orderApi";

import OrderHeader      from "./order-header";
import OrderStats       from "./order-stats";
import OrderFilters     from "./order-filters";
import OrderTable       from "./order-table";
import OrderPagination  from "./order-pagination";
import OrderViewModal   from "./order-view-modal";
import OrderStatusModal from "./order-status-modal";

const PAGE_SIZE = 10;

type ModalState =
    | { type: "none" }
    | { type: "view";   order: OrderDTO }
    | { type: "status"; order: OrderDTO };

export default function OrderManagement() {
    // ─── Filter state ─────────────────────────────────────────────────────────
    const [keyword,      setKeyword]      = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [page,         setPage]         = useState(0);

    // ─── Data state ───────────────────────────────────────────────────────────
    const [orders,      setOrders]      = useState<OrderDTO[]>([]);
    const [totalPages,  setTotalPages]  = useState(0);
    const [totalItems,  setTotalItems]  = useState(0);
    const [stats,       setStats]       = useState<OrderStatsResponse | null>(null);
    const [loadingList, setLoadingList] = useState(false);
    const [loadingStats,setLoadingStats]= useState(false);

    // ─── Modal state ──────────────────────────────────────────────────────────
    const [modal, setModal] = useState<ModalState>({ type: "none" });

    // ─── Fetch orders ─────────────────────────────────────────────────────────
    const fetchOrders = useCallback(async () => {
        setLoadingList(true);
        try {
            const res = await getOrders({
                keyword:  keyword  || undefined,
                status:   filterStatus !== "all" ? filterStatus : undefined,
                page,
                size: PAGE_SIZE,
            });
            setOrders(res.orders);
            setTotalPages(res.totalPages);
            setTotalItems(res.totalItems);
        } catch {
            // giữ dữ liệu cũ nếu lỗi
        } finally {
            setLoadingList(false);
        }
    }, [keyword, filterStatus, page]);

    // ─── Fetch stats ──────────────────────────────────────────────────────────
    const fetchStats = useCallback(async () => {
        setLoadingStats(true);
        try {
            const res = await getOrderStats();
            setStats(res);
        } catch { /* ignore */ }
        finally { setLoadingStats(false); }
    }, []);

    // Reset page khi filter thay đổi
    useEffect(() => { setPage(0); }, [keyword, filterStatus]);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    useEffect(() => { fetchStats(); }, [fetchStats]);

    // ─── Handlers ─────────────────────────────────────────────────────────────
    const handleStatusUpdated = async (updated: OrderDTO) => {
        setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
        await fetchStats();
        setModal({ type: "none" });
    };

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <div className="mx-auto max-w-[1600px] space-y-6">
            <OrderHeader />

            <OrderStats stats={stats} loading={loadingStats} />

            <OrderFilters
                keyword={keyword}
                setKeyword={setKeyword}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
            />

            <OrderTable
                orders={orders}
                totalItems={totalItems}
                loading={loadingList}
                onView={(order)         => setModal({ type: "view",   order })}
                onChangeStatus={(order) => setModal({ type: "status", order })}
            />

            <OrderPagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={totalItems}
                pageSize={PAGE_SIZE}
                onPageChange={setPage}
            />

            {/* Modals */}
            {modal.type === "view" && (
                <OrderViewModal
                    order={modal.order}
                    onClose={() => setModal({ type: "none" })}
                />
            )}

            {modal.type === "status" && (
                <OrderStatusModal
                    order={modal.order}
                    onClose={() => setModal({ type: "none" })}
                    onUpdated={handleStatusUpdated}
                />
            )}
        </div>
    );
}
