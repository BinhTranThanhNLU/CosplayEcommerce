package com.springboot.cosplay.controller;

import com.springboot.cosplay.entity.User;
import com.springboot.cosplay.requestDto.AddToCartRequest;
import com.springboot.cosplay.requestDto.CheckoutRequest;
import com.springboot.cosplay.requestDto.UpdateCartItemRequest;
import com.springboot.cosplay.responseDto.CartResponse;
import com.springboot.cosplay.responseDto.CheckoutResponse;
import com.springboot.cosplay.security.UserDetailsImpl;
import com.springboot.cosplay.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
public class CartController {
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<CartResponse> getCart(@AuthenticationPrincipal UserDetailsImpl principal) {
        return ResponseEntity.ok(cartService.getCart(currentUser(principal)));
    }

    @GetMapping("/count")
    public ResponseEntity<Integer> getCartCount(@AuthenticationPrincipal UserDetailsImpl principal) {
        return ResponseEntity.ok(cartService.getCart(currentUser(principal)).getTotalQuantity());
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addToCart(@AuthenticationPrincipal UserDetailsImpl principal,
                                                  @RequestBody AddToCartRequest request) {
        return ResponseEntity.ok(cartService.addToCart(
                currentUser(principal),
                request.getProductVariantId(),
                request.getQuantity()
        ));
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartResponse> updateQuantity(@AuthenticationPrincipal UserDetailsImpl principal,
                                                       @PathVariable Integer itemId,
                                                       @RequestBody UpdateCartItemRequest request) {
        return ResponseEntity.ok(cartService.updateQuantity(currentUser(principal), itemId, request.getQuantity()));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CartResponse> removeItem(@AuthenticationPrincipal UserDetailsImpl principal,
                                                   @PathVariable Integer itemId) {
        return ResponseEntity.ok(cartService.removeItem(currentUser(principal), itemId));
    }

    @PostMapping("/checkout")
    public ResponseEntity<CheckoutResponse> checkout(@AuthenticationPrincipal UserDetailsImpl principal,
                                                     @RequestBody CheckoutRequest request) {
        return ResponseEntity.ok(cartService.checkout(currentUser(principal), request.getShippingAddress()));
    }

    private User currentUser(UserDetailsImpl principal) {
        return principal.getUser();
    }
}
