package com.springboot.cosplay.responseDto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CartItemResponse {
    private Integer id;
    private Integer productVariantId;
    private Integer productId;
    private String productName;
    private String imageUrl;
    private String size;
    private String color;
    private Integer stock;
    private Integer quantity;
    private Long price;
    private Long salePrice;
    private Long rentPrice;
    private Long depositFee;
    private String itemType;
    private Integer rentalDays;
    private Long lineTotal;
}
