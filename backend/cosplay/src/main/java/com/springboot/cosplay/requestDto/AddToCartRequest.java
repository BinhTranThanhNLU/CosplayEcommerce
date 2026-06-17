package com.springboot.cosplay.requestDto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddToCartRequest {
    private Integer productVariantId;
    private Integer quantity;
}
