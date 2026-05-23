package com.springboot.cosplay.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "shops")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Shop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "seller_id", insertable = false, updatable = false)
    private Integer sellerId;

    @Column(name = "shop_name")
    private String shopName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // ================= SELLER =================
    @ManyToOne
    @JoinColumn(
            name = "seller_id",
            foreignKey = @ForeignKey(name = "shops_ibfk_1")
    )
    private User seller;

    // ================= PRODUCTS =================
    @OneToMany(mappedBy = "shop")
    private List<Product> products;
}