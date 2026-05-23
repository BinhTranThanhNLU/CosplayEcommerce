package com.springboot.cosplay.repository;

import com.springboot.cosplay.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
}
