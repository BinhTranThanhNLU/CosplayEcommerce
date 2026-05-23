package com.springboot.cosplay.responseDto;

import com.springboot.cosplay.dto.ProductDTO;
import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductPageResponse {
    private List<ProductDTO> products;
    private int currentPage;
    private int totalPages;
    private long totalItems;
}
