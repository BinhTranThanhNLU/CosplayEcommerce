package com.springboot.cosplay.repository;

import com.springboot.cosplay.entity.Cart;
import com.springboot.cosplay.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Integer> {
    @EntityGraph(attributePaths = {"items", "items.productVariant", "items.productVariant.product", "items.productVariant.product.shop"})
    Optional<Cart> findByUser(User user);
}
