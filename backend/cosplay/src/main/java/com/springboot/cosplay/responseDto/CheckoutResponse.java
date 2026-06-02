package com.springboot.cosplay.responseDto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CheckoutResponse {
    private Integer orderId;
    private Long totalAmount;
    private String status;
}
