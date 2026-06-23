package com.springboot.cosplay.requestDto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChangeRoleRequest {

    @NotBlank(message = "Vai trò không được để trống")
    private String role; // ADMIN | CUSTOMER | SELLER
}
