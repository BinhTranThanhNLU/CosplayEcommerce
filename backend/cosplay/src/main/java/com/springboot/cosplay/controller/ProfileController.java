package com.springboot.cosplay.controller;

import com.springboot.cosplay.dto.UserDTO;
import com.springboot.cosplay.requestDto.UpdateProfileRequest;
import com.springboot.cosplay.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profile")
public class ProfileController {

    private final UserService userService;

    public ProfileController(UserService userService) {
        this.userService = userService;
    }

    // GET /api/profile/me — Lấy thông tin profile của user đang đăng nhập
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getMyProfile() {
        return ResponseEntity.ok(userService.getMyProfile());
    }

    // PUT /api/profile/me — Cập nhật thông tin profile của user đang đăng nhập
    @PutMapping("/me")
    public ResponseEntity<UserDTO> updateMyProfile(@Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateMyProfile(request));
    }
}
