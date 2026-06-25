package com.springboot.cosplay.responseDto;

import com.springboot.cosplay.dto.OrderDTO;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderPageResponse {
    private List<OrderDTO> orders;
    private int  currentPage;
    private int  totalPages;
    private long totalItems;
}
