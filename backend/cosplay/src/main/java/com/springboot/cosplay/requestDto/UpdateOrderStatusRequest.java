package com.springboot.cosplay.requestDto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateOrderStatusRequest {

    @NotBlank(message = "Trạng thái không được để trống")
    private String status; // PENDING | PROCESSING | SHIPPED | COMPLETED | CANCELLED
}
