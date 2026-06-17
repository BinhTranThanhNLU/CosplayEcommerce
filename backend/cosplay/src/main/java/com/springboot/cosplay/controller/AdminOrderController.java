package com.springboot.cosplay.controller;

import com.springboot.cosplay.dto.OrderDTO;
import com.springboot.cosplay.requestDto.UpdateOrderStatusRequest;
import com.springboot.cosplay.responseDto.OrderPageResponse;
import com.springboot.cosplay.responseDto.OrderStatsResponse;
import com.springboot.cosplay.service.AdminOrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/orders")
public class AdminOrderController {

    private final AdminOrderService adminOrderService;

    public AdminOrderController(AdminOrderService adminOrderService) {
        this.adminOrderService = adminOrderService;
    }

    // GET /api/admin/orders?keyword=&status=&page=0&size=10
    @GetMapping
    public ResponseEntity<OrderPageResponse> getAllOrders(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "all") String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(adminOrderService.getAllOrders(keyword, status, page, size));
    }

    // GET /api/admin/orders/stats
    @GetMapping("/stats")
    public ResponseEntity<OrderStatsResponse> getStats() {
        return ResponseEntity.ok(adminOrderService.getStats());
    }

    // GET /api/admin/orders/{id}
    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Integer id) {
        return ResponseEntity.ok(adminOrderService.getOrderById(id));
    }

    // PATCH /api/admin/orders/{id}/status
    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderDTO> updateStatus(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        return ResponseEntity.ok(adminOrderService.updateStatus(id, request));
    }
}
