package com.springboot.cosplay.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminProductStats {
    private long totalProducts;
    private long sellProducts;
    private long rentProducts;
    private long customProducts;
}