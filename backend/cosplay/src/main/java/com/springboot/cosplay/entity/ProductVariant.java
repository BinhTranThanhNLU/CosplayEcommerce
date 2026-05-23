package com.springboot.cosplay.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_variants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "product_id", insertable = false, updatable = false)
    private Integer productId;

    @Column(name = "size")
    private String size;

    @Column(name = "color")
    private String color;

    @Column(name = "stock")
    private Integer stock;

    @Column(name = "sale_price")
    private Long salePrice;

    @Column(name = "rent_price")
    private Long rentPrice;

    @Column(name = "deposit_fee")
    private Long depositFee;

    // ================= PRODUCT =================
    @ManyToOne
    @JoinColumn(
            name = "product_id",
            foreignKey = @ForeignKey(name = "product_variants_ibfk_1")
    )
    private Product product;
}