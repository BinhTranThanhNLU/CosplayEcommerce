package com.springboot.cosplay.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class AdminShopDTO {
    private Integer id;
    private String shopName;
    private String description;
    private String sellerName;
    private String sellerEmail;
    private int productCount; // Đếm số lượng sản phẩm của shop
    private LocalDateTime createdAt;
}