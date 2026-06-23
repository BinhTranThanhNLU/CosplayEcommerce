package com.springboot.cosplay.controller;

import com.springboot.cosplay.dto.UserDTO;
import com.springboot.cosplay.requestDto.ChangeRoleRequest;
import com.springboot.cosplay.requestDto.ChangeStatusRequest;
import com.springboot.cosplay.requestDto.CreateUserRequest;
import com.springboot.cosplay.requestDto.UpdateUserRequest;
import com.springboot.cosplay.responseDto.UserPageResponse;
import com.springboot.cosplay.responseDto.UserStatsResponse;
import com.springboot.cosplay.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // GET /api/admin/users?keyword=&role=&status=&page=0&size=10
    @GetMapping
    public ResponseEntity<UserPageResponse> getAllUsers(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "all") String role,
            @RequestParam(defaultValue = "all") String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(userService.getAllUsers(keyword, role, status, page, size));
    }

    // POST /api/admin/users
    @PostMapping
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody CreateUserRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(request));
    }

    // GET /api/admin/users/stats
    @GetMapping("/stats")
    public ResponseEntity<UserStatsResponse> getStats() {
        return ResponseEntity.ok(userService.getStats());
    }

    // GET /api/admin/users/{id}
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Integer id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    // PUT /api/admin/users/{id}
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateUserRequest request) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    // PATCH /api/admin/users/{id}/status
    @PatchMapping("/{id}/status")
    public ResponseEntity<UserDTO> changeStatus(
            @PathVariable Integer id,
            @Valid @RequestBody ChangeStatusRequest request) {
        return ResponseEntity.ok(userService.changeStatus(id, request));
    }

    // PATCH /api/admin/users/{id}/role
    @PatchMapping("/{id}/role")
    public ResponseEntity<UserDTO> changeRole(
            @PathVariable Integer id,
            @Valid @RequestBody ChangeRoleRequest request) {
        return ResponseEntity.ok(userService.changeRole(id, request));
    }

    // DELETE /api/admin/users/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
