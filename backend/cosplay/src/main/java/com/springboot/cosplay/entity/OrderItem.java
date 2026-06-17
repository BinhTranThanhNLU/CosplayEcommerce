package com.springboot.cosplay.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "order_id", insertable = false, updatable = false)
    private Integer orderId;

    @Column(name = "product_variant_id", insertable = false, updatable = false)
    private Integer productVariantId;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "price")
    private Long price;

    @Column(name = "is_rental")
    private Boolean rental;

    @ManyToOne
    @JoinColumn(name = "order_id", foreignKey = @ForeignKey(name = "order_items_ibfk_1"))
    private Order order;

    @ManyToOne
    @JoinColumn(name = "product_variant_id", foreignKey = @ForeignKey(name = "order_items_ibfk_2"))
    private ProductVariant productVariant;
}
