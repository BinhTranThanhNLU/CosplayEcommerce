package com.springboot.cosplay.service;

import com.cosplay.dto.CartRequest;
import com.cosplay.entity.CartItem;
import com.cosplay.repository.CartItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    public List<CartItem> getCartByUserId(Long userId) {
        return cartItemRepository.findByUserId(userId);
    }

    @Transactional
    public CartItem addToCart(Long userId, CartRequest request) {
        // Kiểm tra xem món đồ cosplay này (cùng kích cỡ, màu sắc, hình thức thuê/mua) đã có trong giỏ chưa
        Optional<CartItem> existingItem = cartItemRepository
                .findByUserIdAndProductIdAndVariantIdAndRentOrSale(
                        userId, request.getProductId(), request.getVariantId(), request.getRentOrSale()
                );

        if (existingItem.isPresent()) {
            // Nếu đã có, tiến hành cộng dồn số lượng mới vào
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            return cartItemRepository.save(item);
        } else {
            // Nếu chưa có, tạo mới bản ghi vào giỏ hàng
            CartItem newItem = new CartItem();
            newItem.setUserId(userId);
            newItem.setProductId(request.getProductId());
            newItem.setVariantId(request.getVariantId());
            newItem.setQuantity(request.getQuantity());
            newItem.setRentOrSale(request.getRentOrSale());
            return cartItemRepository.save(newItem);
        }
    }

    @Transactional
    public CartItem updateQuantity(Long cartItemId, Integer quantity) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm trong giỏ hàng!"));
        item.setQuantity(quantity);
        return cartItemRepository.save(item);
    }

    @Transactional
    public void removeFromCart(Long cartItemId) {
        cartItemRepository.deleteById(cartItemId);
    }

    @Transactional
    public void clearCart(Long userId) {
        cartItemRepository.deleteByUserId(userId);
    }
}