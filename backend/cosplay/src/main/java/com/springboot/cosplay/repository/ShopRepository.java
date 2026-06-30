package com.springboot.cosplay.repository;

import com.springboot.cosplay.entity.Shop;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ShopRepository extends JpaRepository<Shop, Integer> {

    // Tìm kiếm theo tên shop, tên chủ shop hoặc email
    @Query("SELECT s FROM Shop s LEFT JOIN s.seller u WHERE " +
            "(:keyword IS NULL OR LOWER(s.shopName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Shop> findForAdmin(@Param("keyword") String keyword, Pageable pageable);
}