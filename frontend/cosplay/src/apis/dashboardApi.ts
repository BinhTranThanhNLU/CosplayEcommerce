import axiosClient from "./axiosClient";
import type { OrderDTO } from "./orderApi";

export interface DashboardStatsResponse {
    // Users
    totalUsers:     number;
    newUsersToday:  number;
    totalSellers:   number;
    totalCustomers: number;
    bannedUsers:    number;
    // Orders
    totalOrders:      number;
    pendingOrders:    number;
    processingOrders: number;
    shippedOrders:    number;
    completedOrders:  number;
    cancelledOrders:  number;
    // Revenue
    totalRevenue:  number;
    revenueToday:  number;
    // Recent
    recentOrders: OrderDTO[];
}

export const getDashboardStats = async (): Promise<DashboardStatsResponse> => {
    const response = await axiosClient.get("/admin/dashboard");
    return response.data;
};
