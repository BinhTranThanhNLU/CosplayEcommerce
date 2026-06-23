package com.springboot.cosplay.requestDto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChangeStatusRequest {

    @NotBlank(message = "Trạng thái không được để trống")
    private String status; // ACTIVE | INACTIVE | BANNED
}
