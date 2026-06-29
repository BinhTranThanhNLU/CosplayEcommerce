package com.springboot.cosplay.requestDto;

import com.springboot.cosplay.entity.CartItemType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddToCartRequest {
    private Integer productVariantId;
    private Integer quantity;
    private CartItemType itemType;
    private Integer rentalDays;
}
