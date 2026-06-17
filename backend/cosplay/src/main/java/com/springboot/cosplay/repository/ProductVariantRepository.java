package com.springboot.cosplay.repository;

import com.springboot.cosplay.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, Integer> {
}
