package com.springboot.cosplay.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {

    private Integer id;

    private Integer shopId;
    private String shopName;

    private Integer categoryId;
    private String categoryName;

    private String name;
    private String description;
    private String type;
    private String createdAt;
    private String imageUrl;

    private List<ProductVariantDTO> variants;

}
