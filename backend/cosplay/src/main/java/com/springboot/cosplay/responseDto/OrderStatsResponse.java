package com.springboot.cosplay.responseDto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderStatsResponse {
    private long totalOrders;
    private long pendingOrders;
    private long processingOrders;
    private long shippedOrders;
    private long completedOrders;
    private long cancelledOrders;
    private long totalRevenue;
}
