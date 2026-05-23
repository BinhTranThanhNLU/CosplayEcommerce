package com.springboot.cosplay.responseDto;

import com.springboot.cosplay.dto.UserDTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {

    private String token;
    private UserDTO user;

}
