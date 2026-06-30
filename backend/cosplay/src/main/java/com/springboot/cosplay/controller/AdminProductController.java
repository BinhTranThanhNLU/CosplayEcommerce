package com.springboot.cosplay.controller;

import com.springboot.cosplay.dto.AdminProductStats;
import com.springboot.cosplay.service.AdminProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/admin/products")
public class AdminProductController {

    private final AdminProductService adminProductService;

    public AdminProductController(AdminProductService adminProductService) {
        this.adminProductService = adminProductService;
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminProductStats> getStats() {
        return ResponseEntity.ok(adminProductService.getStats());
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false, defaultValue = "all") String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(adminProductService.getProducts(keyword, type, page, size));
    }
}