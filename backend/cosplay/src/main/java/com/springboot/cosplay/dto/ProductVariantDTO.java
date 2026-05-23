package com.springboot.cosplay.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductVariantDTO {

    private Integer id;
    private String size;
    private String color;
    private Integer stock;

    private Long salePrice;
    private Long rentPrice;
    private Long depositFee;

}
