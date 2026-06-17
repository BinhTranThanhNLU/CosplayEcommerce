package com.springboot.cosplay.repository;

import com.springboot.cosplay.entity.User;
import com.springboot.cosplay.entity.UserRole;
import com.springboot.cosplay.entity.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface UserRepository extends JpaRepository<User, Integer> {

    User findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    // Tìm kiếm kết hợp: keyword (tên/email/username) + role + status
    @Query("""
            SELECT u FROM User u
            WHERE (:keyword IS NULL OR :keyword = ''
                OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(u.email)    LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(u.username) LIKE LOWER(CONCAT('%', :keyword, '%')))
              AND (:role   IS NULL OR u.role   = :role)
              AND (:status IS NULL OR u.status = :status)
            """)
    Page<User> searchUsers(
            @Param("keyword") String keyword,
            @Param("role")    UserRole role,
            @Param("status")  UserStatus status,
            Pageable pageable
    );

    long countByStatus(UserStatus status);

    long countByRole(UserRole role);

    long countByCreatedAtAfter(LocalDateTime dateTime);
}