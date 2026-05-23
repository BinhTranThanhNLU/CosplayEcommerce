package com.springboot.cosplay.service;

import com.springboot.cosplay.dto.CategoryDTO;
import com.springboot.cosplay.entity.Category;
import com.springboot.cosplay.mapper.CategoryMapper;
import com.springboot.cosplay.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    public CategoryService(CategoryRepository categoryRepository, CategoryMapper categoryMapper) {
        this.categoryRepository = categoryRepository;
        this.categoryMapper = categoryMapper;
     }

     public List<CategoryDTO> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return categoryMapper.toDtoList(categories);
     }
}
