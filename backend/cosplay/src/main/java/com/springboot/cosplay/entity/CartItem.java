package com.springboot.cosplay.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cart_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "cart_id", insertable = false, updatable = false)
    private Integer cartId;

    @Column(name = "product_variant_id", insertable = false, updatable = false)
    private Integer productVariantId;

    @Column(name = "quantity")
    private Integer quantity;

    @ManyToOne
    @JoinColumn(name = "cart_id", foreignKey = @ForeignKey(name = "cart_items_ibfk_1"))
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "product_variant_id", foreignKey = @ForeignKey(name = "cart_items_ibfk_2"))
    private ProductVariant productVariant;
}
