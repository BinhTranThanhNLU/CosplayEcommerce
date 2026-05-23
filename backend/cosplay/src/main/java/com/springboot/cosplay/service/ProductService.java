package com.springboot.cosplay.service;

import com.springboot.cosplay.dto.ProductDTO;
import com.springboot.cosplay.entity.Product;
import com.springboot.cosplay.mapper.ProductMapper;
import com.springboot.cosplay.repository.ProductRepository;
import com.springboot.cosplay.responseDto.ProductPageResponse;
import com.springboot.cosplay.specification.ProductSpecification;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.jpa.domain.Specification;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    public ProductService(ProductRepository productRepository, ProductMapper productMapper) {
        this.productRepository = productRepository;
        this.productMapper = productMapper;
    }

    @Transactional(readOnly = true)
    public ProductPageResponse getAllProducts(String type,
                                              String keyword,
                                              Integer categoryId,
                                              Long minPrice,
                                              Long maxPrice,
                                              String sortBy,
                                              String sortDir,
                                              int page,
                                              int size) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.max(size, 1);

        Pageable pageable = PageRequest.of(safePage, safeSize);

        Specification<Product> specification = Specification
                .where(ProductSpecification.hasType(type))
                .and(ProductSpecification.keywordContains(keyword))
                .and(ProductSpecification.hasCategoryId(categoryId))
                .and(ProductSpecification.priceBetween(minPrice, maxPrice))
                .and(ProductSpecification.sortBy(sortBy, sortDir));

        Page<Product> pageResult = productRepository.findAll(specification, pageable);
        List<ProductDTO> productDTOs = productMapper.toDtoList(pageResult.getContent());
        
        return ProductPageResponse.builder()
                .products(productDTOs)
                .currentPage(pageResult.getNumber())
                .totalPages(pageResult.getTotalPages())
                .totalItems(pageResult.getTotalElements())
                .build();
    }

    @Transactional(readOnly = true)
    public ProductDTO getProductById(Integer id) {
        Product product = productRepository.findById(id).orElse(null);
        return product != null ? productMapper.toDto(product) : null;
    }
}

