package com.springboot.cosplay.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemDTO {
    private Integer id;
    private Integer productVariantId;
    private String  productName;
    private String  imageUrl;
    private String  size;
    private String  color;
    private Integer quantity;
    private Long    price;
    private Long    lineTotal;
    private Boolean rental;
}
