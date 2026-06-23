package com.springboot.cosplay.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GoogleUserInfoDTO {

    private String email;
    private String name;
    private String picture;

}
