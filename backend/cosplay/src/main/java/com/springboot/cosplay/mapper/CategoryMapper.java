package com.springboot.cosplay.mapper;

import com.springboot.cosplay.dto.CategoryDTO;
import com.springboot.cosplay.entity.Category;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")

public interface CategoryMapper {

    CategoryDTO toDto(Category category);

    List<CategoryDTO> toDtoList(List<Category> categories);
}
