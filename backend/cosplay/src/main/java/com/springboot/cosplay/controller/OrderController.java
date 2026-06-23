package com.springboot.cosplay.controller;

import com.springboot.cosplay.entity.User;
import com.springboot.cosplay.repository.OrderRepository;
import com.springboot.cosplay.requestDto.CheckoutRequest;
import com.springboot.cosplay.responseDto.CheckoutResponse;
import com.springboot.cosplay.security.UserDetailsImpl;
import com.springboot.cosplay.service.OrderService;
import com.springboot.cosplay.service.VNPayService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Map;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;
    private final VNPayService vnPayService;
    private final OrderRepository orderRepository;

    public OrderController(OrderService orderService, VNPayService vnPayService, OrderRepository orderRepository) {
        this.orderService = orderService;
        this.vnPayService = vnPayService;
        this.orderRepository = orderRepository;
    }


    @PostMapping("/checkout")
    public ResponseEntity<CheckoutResponse> checkout(
            @AuthenticationPrincipal UserDetailsImpl principal,
            @RequestBody CheckoutRequest request,
            HttpServletRequest httpRequest) { // Lấy request để tìm IP

        // Lấy IP thật của khách hàng
        String ipAddress = httpRequest.getHeader("X-Forwarded-For");
        if (ipAddress == null || ipAddress.isEmpty()) {
            ipAddress = httpRequest.getRemoteAddr();
        }

        return ResponseEntity.ok(orderService.checkout(currentUser(principal), request, ipAddress));
    }

    @GetMapping("/vnpay-return")
    public ResponseEntity<Void> vnpayReturn(@RequestParam Map<String, String> params) {
        // Gọi Service xử lý và lấy link đích của Frontend
        String redirectUrl = orderService.handleVnPayReturn(params);

        // Bắn lệnh Redirect (302) về cho trình duyệt
        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create(redirectUrl))
                .build();
    }

    private User currentUser(UserDetailsImpl principal) {
        return principal.getUser();
    }

}
