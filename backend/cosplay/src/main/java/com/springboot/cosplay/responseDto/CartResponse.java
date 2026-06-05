package com.springboot.cosplay.responseDto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class CartResponse {
    private Integer id;
    private List<CartItemResponse> items;
    private Integer totalQuantity;
    private Long totalAmount;
}
