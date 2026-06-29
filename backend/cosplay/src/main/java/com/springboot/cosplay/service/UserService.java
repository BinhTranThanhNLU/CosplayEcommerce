package com.springboot.cosplay.service;

import com.springboot.cosplay.dto.UserDTO;
import com.springboot.cosplay.entity.User;
import com.springboot.cosplay.entity.UserRole;
import com.springboot.cosplay.entity.UserStatus;
import com.springboot.cosplay.exception.ResourceNotFoundException;
import com.springboot.cosplay.repository.UserRepository;
import com.springboot.cosplay.requestDto.ChangeRoleRequest;
import com.springboot.cosplay.requestDto.ChangeStatusRequest;
import com.springboot.cosplay.requestDto.CreateUserRequest;
import com.springboot.cosplay.requestDto.UpdateProfileRequest;
import com.springboot.cosplay.requestDto.UpdateUserRequest;
import com.springboot.cosplay.responseDto.UserPageResponse;
import com.springboot.cosplay.responseDto.UserStatsResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.text.Normalizer;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ─── Lấy danh sách users (phân trang + lọc) ───────────────────────────────

    @Transactional(readOnly = true)
    public UserPageResponse getAllUsers(String keyword,
                                       String role,
                                       String status,
                                       int page,
                                       int size) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.max(size, 1);

        Pageable pageable = PageRequest.of(safePage, safeSize, Sort.by(Sort.Direction.DESC, "createdAt"));

        UserRole userRole   = resolveRole(role);
        UserStatus userStatus = resolveStatus(status);
        String kw = (keyword == null || keyword.isBlank()) ? null : keyword.trim();

        Page<User> pageResult = userRepository.searchUsers(kw, userRole, userStatus, pageable);
        List<UserDTO> dtos = pageResult.getContent().stream().map(this::toDTO).toList();

        return UserPageResponse.builder()
                .users(dtos)
                .currentPage(pageResult.getNumber())
                .totalPages(pageResult.getTotalPages())
                .totalItems(pageResult.getTotalElements())
                .build();
    }

    // ─── Lấy chi tiết 1 user ──────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public UserDTO getUserById(Integer id) {
        User user = findUserOrThrow(id);
        return toDTO(user);
    }

    // ─── Lấy profile của user đang đăng nhập ─────────────────────────────────

    @Transactional(readOnly = true)
    public UserDTO getMyProfile() {
        String email = getCurrentUserEmail();
        User user = findUserByEmailOrThrow(email);
        return toDTO(user);
    }

    // ─── Cập nhật profile của user đang đăng nhập ────────────────────────────

    @Transactional
    public UserDTO updateMyProfile(UpdateProfileRequest request) {
        String email = getCurrentUserEmail();
        User user = findUserByEmailOrThrow(email);

        user.setFullName(request.getFullName().trim());

        if (request.getPhone() != null) {
            user.setPhone(request.getPhone().trim().isEmpty() ? null : request.getPhone().trim());
        }
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl().trim().isEmpty() ? null : request.getAvatarUrl().trim());
        }

        return toDTO(userRepository.save(user));
    }

    // ─── Cập nhật thông tin user ──────────────────────────────────────────────

    @Transactional
    public UserDTO updateUser(Integer id, UpdateUserRequest request) {
        User user = findUserOrThrow(id);

        user.setFullName(request.getFullName().trim());

        if (request.getPhone() != null) {
            user.setPhone(request.getPhone().trim().isEmpty() ? null : request.getPhone().trim());
        }
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl().trim().isEmpty() ? null : request.getAvatarUrl().trim());
        }
        if (request.getRole() != null && !request.getRole().isBlank()) {
            user.setRole(resolveRoleStrict(request.getRole()));
        }

        return toDTO(userRepository.save(user));
    }

    // ─── Đổi trạng thái (ACTIVE / INACTIVE / BANNED) ─────────────────────────

    @Transactional
    public UserDTO changeStatus(Integer id, ChangeStatusRequest request) {
        User user = findUserOrThrow(id);
        UserStatus newStatus = resolveStatusStrict(request.getStatus());
        user.setStatus(newStatus);
        return toDTO(userRepository.save(user));
    }

    // ─── Đổi vai trò (ADMIN / CUSTOMER / SELLER) ─────────────────────────────

    @Transactional
    public UserDTO changeRole(Integer id, ChangeRoleRequest request) {
        User user = findUserOrThrow(id);
        UserRole newRole = resolveRoleStrict(request.getRole());
        user.setRole(newRole);
        return toDTO(userRepository.save(user));
    }

    // ─── Tạo user mới (admin tạo) ─────────────────────────────────────────────

    @Transactional
    public UserDTO createUser(CreateUserRequest request) {
        String email = request.getEmail().trim().toLowerCase(Locale.ROOT);

        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email này đã được sử dụng");
        }

        UserRole role = resolveRoleOrDefault(request.getRole());
        String fullName = request.getFullName().trim();
        String username = generateUniqueUsername(fullName, email);

        User user = new User();
        user.setUsername(username);
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);
        user.setStatus(UserStatus.ACTIVE);
        user.setCreatedAt(LocalDateTime.now());

        if (request.getPhone() != null && !request.getPhone().isBlank()) {
            user.setPhone(request.getPhone().trim());
        }

        return toDTO(userRepository.save(user));
    }

    // ─── Xóa user ─────────────────────────────────────────────────────────────

    @Transactional
    public void deleteUser(Integer id) {
        User user = findUserOrThrow(id);
        userRepository.delete(user);
    }

    // ─── Thống kê ─────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public UserStatsResponse getStats() {
        long total    = userRepository.count();
        long banned   = userRepository.countByStatus(UserStatus.BANNED);
        long active   = userRepository.countByStatus(UserStatus.ACTIVE);
        long customer = userRepository.countByRole(UserRole.CUSTOMER);
        long seller   = userRepository.countByRole(UserRole.SELLER);

        return UserStatsResponse.builder()
                .totalUsers(total)
                .bannedUsers(banned)
                .activeUsers(active)
                .customerCount(customer)
                .sellerCount(seller)
                .build();
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    private User findUserOrThrow(Integer id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user với id: " + id));
    }

    private User findUserByEmailOrThrow(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new ResourceNotFoundException("Không tìm thấy user với email: " + email);
        }
        return user;
    }

    private String getCurrentUserEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    private UserDTO toDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setRole(user.getRole());
        dto.setStatus(user.getStatus());
        dto.setFullName(user.getFullName());
        dto.setAvatarUrl(user.getAvatarUrl());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }

    private UserRole resolveRole(String value) {
        if (value == null || value.isBlank() || "all".equalsIgnoreCase(value)) {
            return null;
        }
        try {
            return UserRole.valueOf(value.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    private UserRole resolveRoleStrict(String value) {
        try {
            return UserRole.valueOf(value.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vai trò không hợp lệ: " + value);
        }
    }

    private UserStatus resolveStatus(String value) {
        if (value == null || value.isBlank() || "all".equalsIgnoreCase(value)) {
            return null;
        }
        try {
            return UserStatus.valueOf(value.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    private UserStatus resolveStatusStrict(String value) {
        try {
            return UserStatus.valueOf(value.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Trạng thái không hợp lệ: " + value);
        }
    }

    // Trả về CUSTOMER nếu role null hoặc rỗng
    private UserRole resolveRoleOrDefault(String value) {
        if (value == null || value.isBlank()) {
            return UserRole.CUSTOMER;
        }
        return resolveRoleStrict(value);
    }

    // Tạo username unique từ email local-part
    private String generateUniqueUsername(String fullName, String email) {
        String base = normalizeSlug(extractEmailLocalPart(email));
        if (base.isBlank()) {
            base = normalizeSlug(fullName);
        }
        if (base.isBlank()) {
            base = "user";
        }

        String username = base;
        int suffix = 2;
        while (userRepository.existsByUsername(username)) {
            username = base + "-" + suffix++;
        }
        return username;
    }

    private String extractEmailLocalPart(String email) {
        int at = email.indexOf('@');
        return at > 0 ? email.substring(0, at) : email;
    }

    private String normalizeSlug(String value) {
        if (value == null) return "";
        return Normalizer.normalize(value, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-+|-+$", "");
    }
}

