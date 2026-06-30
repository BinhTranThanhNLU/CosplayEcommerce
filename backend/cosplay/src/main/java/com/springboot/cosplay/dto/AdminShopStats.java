package com.springboot.cosplay.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminShopStats {
    private long totalShops;
    private long totalSellers;
}