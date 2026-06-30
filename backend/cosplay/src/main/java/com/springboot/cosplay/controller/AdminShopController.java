package com.springboot.cosplay.controller;

import com.springboot.cosplay.dto.AdminShopStats;
import com.springboot.cosplay.service.AdminShopService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/admin/shops")
public class AdminShopController {

    private final AdminShopService adminShopService;

    public AdminShopController(AdminShopService adminShopService) {
        this.adminShopService = adminShopService;
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminShopStats> getStats() {
        return ResponseEntity.ok(adminShopService.getStats());
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getShops(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(adminShopService.getShops(keyword, page, size));
    }
}