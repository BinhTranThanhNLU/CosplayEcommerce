package com.springboot.cosplay.responseDto;

import com.springboot.cosplay.dto.OrderDTO;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsResponse {

    // ── Users ──────────────────────────────────────────────────────────────────
    private long totalUsers;
    private long newUsersToday;
    private long totalSellers;
    private long totalCustomers;
    private long bannedUsers;

    // ── Orders ─────────────────────────────────────────────────────────────────
    private long totalOrders;
    private long pendingOrders;
    private long processingOrders;
    private long shippedOrders;
    private long completedOrders;
    private long cancelledOrders;

    // ── Revenue ────────────────────────────────────────────────────────────────
    private long totalRevenue;       // tổng từ đơn COMPLETED
    private long revenueToday;       // đơn COMPLETED trong ngày hôm nay

    // ── Recent orders ──────────────────────────────────────────────────────────
    private List<OrderDTO> recentOrders; // 5 đơn mới nhất
}
