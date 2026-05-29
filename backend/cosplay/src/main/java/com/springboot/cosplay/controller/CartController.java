package com.cosplay.controller;

import com.cosplay.dto.CartRequest;
import com.cosplay.entity.CartItem;
import com.cosplay.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*") // Cho phép gọi API từ Frontend React
public class CartController {

    @Autowired
    private CartService cartService;

    // Giả lập ID User, sau này bạn thay thế bằng ID lấy từ Token JWT khi đăng nhập
    private final Long mockUserId = 1L;

    @GetMapping
    public ResponseEntity<List<CartItem>> getCart() {
        return ResponseEntity.ok(cartService.getCartByUserId(mockUserId));
    }

    @PostMapping("/add")
    public ResponseEntity<CartItem> addToCart(@RequestBody CartRequest request) {
        return ResponseEntity.ok(cartService.addToCart(mockUserId, request));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<CartItem> updateQuantity(@PathVariable Long id, @RequestParam Integer quantity) {
        return ResponseEntity.ok(cartService.updateQuantity(id, quantity));
    }

    @DeleteMapping("/remove/{id}")
    public ResponseEntity<String> removeFromCart(@PathVariable Long id) {
        cartService.removeFromCart(id);
        return ResponseEntity.ok("Đã xóa sản phẩm khỏi giỏ hàng thành công!");
    }

    @DeleteMapping("/clear")
    public ResponseEntity<String> clearCart() {
        cartService.clearCart(mockUserId);
        return ResponseEntity.ok("Đã xóa toàn bộ giỏ hàng!");
    }
}