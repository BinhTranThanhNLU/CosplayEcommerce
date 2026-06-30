package com.springboot.cosplay.repository;

import com.springboot.cosplay.entity.Product;
import com.springboot.cosplay.entity.ProductType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Integer>, JpaSpecificationExecutor<Product> {

    long countByType(ProductType type);

    @Query("SELECT p FROM Product p WHERE " +
            "(:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
            "(:type IS NULL OR p.type = :type)")
    Page<Product> findForAdmin(@Param("keyword") String keyword, @Param("type") ProductType type, Pageable pageable);

}


