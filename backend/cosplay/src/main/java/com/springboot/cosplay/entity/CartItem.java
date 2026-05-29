package com.springboot.cosplay.entity; // Đổi lại package đúng theo dự án của bạn

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "cart_items")
@Data
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(name = "variant_id", nullable = false)
    private Long variantId;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "rent_or_sale", nullable = false, length = 10)
    private String rentOrSale; // "RENT" (Thuê) hoặc "SALE" (Mua)

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}