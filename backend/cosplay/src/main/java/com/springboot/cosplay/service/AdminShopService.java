package com.springboot.cosplay.service;

import com.springboot.cosplay.dto.AdminShopDTO;
import com.springboot.cosplay.dto.AdminShopStats;
import com.springboot.cosplay.entity.Shop;
import com.springboot.cosplay.repository.ShopRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminShopService {

    private final ShopRepository shopRepository;

    public AdminShopService(ShopRepository shopRepository) {
        this.shopRepository = shopRepository;
    }

    @Transactional(readOnly = true)
    public AdminShopStats getStats() {
        return AdminShopStats.builder()
                .totalShops(shopRepository.count())
                // Giả định mỗi shop là 1 seller, nếu logic của bạn 1 seller có nhiều shop thì có thể count distinct seller_id
                .totalSellers(shopRepository.count())
                .build();
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getShops(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        String searchKeyword = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null;

        Page<Shop> shopPage = shopRepository.findForAdmin(searchKeyword, pageable);

        List<AdminShopDTO> shopDTOs = shopPage.getContent().stream().map(s ->
                AdminShopDTO.builder()
                        .id(s.getId())
                        .shopName(s.getShopName())
                        .description(s.getDescription())
                        .sellerName(s.getSeller() != null ? s.getSeller().getFullName() : "Không có")
                        .sellerEmail(s.getSeller() != null ? s.getSeller().getEmail() : "Không có")
                        // Lấy số lượng sản phẩm đang có trong shop
                        .productCount(s.getProducts() != null ? s.getProducts().size() : 0)
                        .createdAt(s.getCreatedAt())
                        .build()
        ).toList();

        Map<String, Object> response = new HashMap<>();
        response.put("shops", shopDTOs);
        response.put("currentPage", shopPage.getNumber());
        response.put("totalItems", shopPage.getTotalElements());
        response.put("totalPages", shopPage.getTotalPages());

        return response;
    }
}