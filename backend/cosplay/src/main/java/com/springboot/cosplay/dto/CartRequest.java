package com.springboot.cosplay.dto;

import lombok.Data;

@Data
public class CartRequest {
    private Long productId;
    private Long variantId;
    private Integer quantity;
    private String rentOrSale; // "RENT" hoặc "SALE"
}