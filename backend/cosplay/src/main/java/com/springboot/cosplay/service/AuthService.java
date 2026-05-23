package com.springboot.cosplay.service;

import com.springboot.cosplay.dto.UserDTO;
import com.springboot.cosplay.entity.User;
import com.springboot.cosplay.entity.UserRole;
import com.springboot.cosplay.entity.UserStatus;
import com.springboot.cosplay.repository.UserRepository;
import com.springboot.cosplay.requestDto.RegisterRequest;
import com.springboot.cosplay.responseDto.LoginResponse;
import com.springboot.cosplay.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.text.Normalizer;
import java.time.LocalDateTime;
import java.util.Locale;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(String email, String rawPassword) {
        String normalizedEmail = normalizeEmail(email);
        User user = userRepository.findByEmail(normalizedEmail);

        if (user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sai email hoặc mật khẩu");
        }

        if (user.getStatus() != null && user.getStatus() != UserStatus.ACTIVE) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Tài khoản của bạn hiện không hoạt động");
        }

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sai email hoặc mật khẩu");
        }

        String token = jwtService.generateToken(user.getEmail());
        return new LoginResponse(token, toUserDTO(user));
    }

    @Transactional
    public void register(RegisterRequest request) {
        String email = normalizeEmail(request.getEmail());
        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email đã được đăng ký");
        }

        UserRole role = resolveRole(request.getRole());
        String fullName = request.getName().trim();
        String username = generateUniqueUsername(fullName, email);

        User user = new User();
        user.setUsername(username);
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);
        user.setStatus(UserStatus.ACTIVE);
        user.setCreatedAt(LocalDateTime.now());

        userRepository.save(user);
    }

    private UserDTO toUserDTO(User user) {
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

    private String normalizeEmail(String email) {
        if (email == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email không được để trống");
        }
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private UserRole resolveRole(String roleValue) {
        if (roleValue == null || roleValue.isBlank()) {
            return UserRole.CUSTOMER;
        }

        return switch (roleValue.trim().toLowerCase(Locale.ROOT)) {
            case "customer", "user" -> UserRole.CUSTOMER;
            case "seller", "artist" -> UserRole.SELLER;
            default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vai trò không hợp lệ");
        };
    }

    private String generateUniqueUsername(String fullName, String email) {
        String base = normalizeUsername(extractEmailLocalPart(email));
        if (base.isBlank()) {
            base = normalizeUsername(fullName);
        }
        if (base.isBlank()) {
            base = "user";
        }

        String username = base;
        int suffix = 2;
        while (true) {
            final String currentUsername = username;
            boolean exists = userRepository.findAll().stream()
                    .anyMatch(existingUser -> currentUsername.equals(existingUser.getUsername()));
            if (!exists) {
                break;
            }
            username = base + "-" + suffix++;
        }
        return username;
    }

    private String extractEmailLocalPart(String email) {
        int atIndex = email.indexOf('@');
        return atIndex > 0 ? email.substring(0, atIndex) : email;
    }

    private String normalizeUsername(String value) {
        if (value == null) {
            return "";
        }

        return Normalizer.normalize(value, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-+|-+$", "");
    }
}