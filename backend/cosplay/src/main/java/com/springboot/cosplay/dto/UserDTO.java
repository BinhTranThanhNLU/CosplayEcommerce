package com.springboot.cosplay.dto;

import com.springboot.cosplay.entity.UserRole;
import com.springboot.cosplay.entity.UserStatus;

import java.time.LocalDateTime;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {

	private Integer id;
	private String username;
	private String email;
	private String phone;
	private UserRole role;
	private UserStatus status;
	private String fullName;
	private String avatarUrl;
	private LocalDateTime createdAt;

}
