package com.springboot.cosplay.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class AdminProductDTO {
    private Integer id;
    private String name;
    private String imageUrl;
    private String type; // SELL, RENT, CUSTOM_MADE
    private String shopName;
    private String categoryName;
    private LocalDateTime createdAt;
}
