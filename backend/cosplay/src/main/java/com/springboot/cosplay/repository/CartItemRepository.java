package com.springboot.cosplay.repository;

import com.springboot.cosplay.entity.Cart;
import com.springboot.cosplay.entity.CartItem;
import com.springboot.cosplay.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    Optional<CartItem> findByCartAndProductVariant(Cart cart, ProductVariant productVariant);
    void deleteByCart(Cart cart);
}
