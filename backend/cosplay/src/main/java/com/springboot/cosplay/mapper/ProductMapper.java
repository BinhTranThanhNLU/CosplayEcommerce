package com.springboot.cosplay.mapper;

import com.springboot.cosplay.dto.ProductDTO;
import com.springboot.cosplay.dto.ProductVariantDTO;
import com.springboot.cosplay.entity.Product;
import com.springboot.cosplay.entity.ProductVariant;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(source = "shop.id", target = "shopId")
    @Mapping(source = "shop.shopName", target = "shopName")
    @Mapping(source = "category.id", target = "categoryId")
    @Mapping(source = "category.name", target = "categoryName")
    @Mapping(source = "type", target = "type")
    @Mapping(source = "variants", target = "variants")
    @Mapping(target = "createdAt", expression = "java(formatDateTime(product.getCreatedAt()))")
    ProductDTO toDto(Product product);

    default List<ProductDTO> toDtoList(List<Product> products) {
        return products.stream().map(this::toDto).toList();
    }

    @Mapping(target = "id", source = "id")
    ProductVariantDTO toVariantDto(ProductVariant variant);

    default List<ProductVariantDTO> toVariantDtoList(List<ProductVariant> variants) {
        if (variants == null) {
            return null;
        }
        return variants.stream().map(this::toVariantDto).toList();
    }

    default String formatDateTime(LocalDateTime dateTime) {
        if (dateTime == null) {
            return null;
        }
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
        return dateTime.format(formatter);
    }
}

