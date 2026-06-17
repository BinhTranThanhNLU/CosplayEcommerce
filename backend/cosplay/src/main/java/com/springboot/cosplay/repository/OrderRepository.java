package com.springboot.cosplay.repository;

import com.springboot.cosplay.entity.Order;
import com.springboot.cosplay.entity.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Integer> {

    // Tìm kiếm kết hợp: keyword (id/tên khách/tên shop) + status
    @Query("""
            SELECT o FROM Order o
            LEFT JOIN o.user  u
            LEFT JOIN o.shop  s
            WHERE (:status IS NULL OR o.status = :status)
              AND (:keyword IS NULL OR :keyword = ''
                OR CAST(o.id AS string)          LIKE CONCAT('%', :keyword, '%')
                OR LOWER(u.fullName)             LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(u.email)                LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(s.shopName)             LIKE LOWER(CONCAT('%', :keyword, '%')))
            """)
    Page<Order> searchOrders(
            @Param("keyword") String keyword,
            @Param("status")  OrderStatus status,
            Pageable pageable
    );

    long countByStatus(OrderStatus status);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status = 'COMPLETED'")
    long sumCompletedRevenue();

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status = 'COMPLETED' AND o.createdAt >= :from")
    long sumCompletedRevenueAfter(@Param("from") LocalDateTime from);

    // 5 đơn mới nhất
    List<Order> findTop5ByOrderByCreatedAtDesc();
}
