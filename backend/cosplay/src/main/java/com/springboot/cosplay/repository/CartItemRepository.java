package com.springboot.cosplay.repository;

import com.cosplay.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    // Lấy toàn bộ sản phẩm trong giỏ hàng của 1 User
    List<CartItem> findByUserId(Long userId);

    // Tìm xem sản phẩm cùng biến thể và cùng hình thức thuê/mua đã có trong giỏ chưa
    Optional<CartItem> findByUserIdAndProductIdAndVariantIdAndRentOrSale(
            Long userId, Long productId, Long variantId, String rentOrSale
    );

    // Xóa toàn bộ giỏ hàng sau khi user đặt hàng thành công
    void deleteByUserId(Long userId);
}