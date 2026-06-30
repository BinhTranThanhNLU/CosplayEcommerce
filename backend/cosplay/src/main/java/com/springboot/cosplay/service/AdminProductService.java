package com.springboot.cosplay.service;

import com.springboot.cosplay.dto.AdminProductDTO;
import com.springboot.cosplay.dto.AdminProductStats;
import com.springboot.cosplay.entity.Product;
import com.springboot.cosplay.entity.ProductType; // Nhớ import Enum
import com.springboot.cosplay.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminProductService {

    private final ProductRepository productRepository;

    public AdminProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public AdminProductStats getStats() {
        return AdminProductStats.builder()
                .totalProducts(productRepository.count())
                // Dùng Enum thay vì String
                .sellProducts(productRepository.countByType(ProductType.SELL))
                .rentProducts(productRepository.countByType(ProductType.RENT))
                .customProducts(productRepository.countByType(ProductType.CUSTOM_MADE))
                .build();
    }

    public Map<String, Object> getProducts(String keyword, String type, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        String searchKeyword = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null;

        // Chuyển String type thành Enum ProductType
        ProductType filterTypeEnum = null;
        if (type != null && !type.equals("all")) {
            try {
                filterTypeEnum = ProductType.valueOf(type);
            } catch (IllegalArgumentException e) {
                // Nếu Frontend gửi type tào lao không có trong Enum thì bỏ qua, coi như không filter
                filterTypeEnum = null;
            }
        }

        // Truyền filterTypeEnum vào
        Page<Product> productPage = productRepository.findForAdmin(searchKeyword, filterTypeEnum, pageable);

        List<AdminProductDTO> productDTOs = productPage.getContent().stream().map(p ->
                AdminProductDTO.builder()
                        .id(p.getId())
                        .name(p.getName())
                        .imageUrl(p.getImageUrl())
                        // Gọi .name() để lấy String từ Enum
                        .type(p.getType() != null ? p.getType().name() : "Không rõ")
                        .shopName(p.getShop() != null ? p.getShop().getShopName() : "Không có")
                        .categoryName(p.getCategory() != null ? p.getCategory().getName() : "Không có")
                        .createdAt(p.getCreatedAt())
                        .build()
        ).toList();

        Map<String, Object> response = new HashMap<>();
        response.put("products", productDTOs);
        response.put("currentPage", productPage.getNumber());
        response.put("totalItems", productPage.getTotalElements());
        response.put("totalPages", productPage.getTotalPages());

        return response;
    }
}