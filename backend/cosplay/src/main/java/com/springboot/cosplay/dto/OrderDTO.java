package com.springboot.cosplay.dto;

import com.springboot.cosplay.entity.OrderStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDTO {
    private Integer         id;
    private Integer         userId;
    private String          customerName;
    private String          customerEmail;
    private Integer         shopId;
    private String          shopName;
    private Long            totalAmount;
    private OrderStatus     status;
    private String          shippingAddress;
    private LocalDateTime   createdAt;
    private List<OrderItemDTO> items;
}
