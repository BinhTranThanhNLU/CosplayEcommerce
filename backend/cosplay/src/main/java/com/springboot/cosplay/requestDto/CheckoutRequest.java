package com.springboot.cosplay.requestDto;

import com.springboot.cosplay.entity.PaymentMethod;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CheckoutRequest {
    private String shippingAddress;
    private PaymentMethod paymentMethod;
    private List<Integer> selectedCartItemIds;
}
