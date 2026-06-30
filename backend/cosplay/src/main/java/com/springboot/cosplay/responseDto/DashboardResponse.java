package com.springboot.cosplay.responseDto;

import com.springboot.cosplay.dto.OrderDTO;
import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class DashboardResponse {
    // 1. Các con số thống kê (Stats)
    private long totalRevenue;
    private long totalOrders;
    private long totalUsers;
    private long totalShops;

    // 2. Dữ liệu cho Biểu đồ (Charts)
    private List<DailyRevenue> revenueChart; // Doanh thu 7 ngày qua
    private Map<String, Long> orderStatusChart; // Phân bổ trạng thái đơn hàng

    // 3. Dữ liệu cho Bảng (Tables)
    private List<OrderDTO> recentOrders; // 5 đơn hàng mới nhất

    @Data
    @Builder
    public static class DailyRevenue {
        private String date;
        private long revenue;
    }
}
