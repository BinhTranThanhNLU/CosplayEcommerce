package com.springboot.cosplay.specification;

import com.springboot.cosplay.entity.Product;
import com.springboot.cosplay.entity.ProductType;
import com.springboot.cosplay.entity.ProductVariant;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Order;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import java.text.Normalizer;
import java.util.Locale;
import org.springframework.data.jpa.domain.Specification;

public final class ProductSpecification {

	private ProductSpecification() {
	}

	public static Specification<Product> hasType(String type) {
		ProductType productType = resolveProductType(type);
		return (root, query, cb) -> {
			query.distinct(true);
			return productType == null ? cb.conjunction() : cb.equal(root.get("type"), productType);
		};
	}

	public static Specification<Product> keywordContains(String keyword) {
		return (root, query, cb) -> {
			query.distinct(true);

			if (keyword == null || keyword.isBlank()) {
				return cb.conjunction();
			}

			String likePattern = toLikePattern(keyword);

			Predicate nameMatch = cb.like(cb.lower(root.get("name")), likePattern);
			Predicate descriptionMatch = cb.like(cb.lower(root.get("description")), likePattern);
			Predicate categoryMatch = cb.like(cb.lower(root.get("category").get("name")), likePattern);
			Predicate shopMatch = cb.like(cb.lower(root.get("shop").get("shopName")), likePattern);
			Predicate variantMatch = buildVariantKeywordMatch(root, query, cb, likePattern);

			return cb.or(nameMatch, descriptionMatch, categoryMatch, shopMatch, variantMatch);
		};
	}

	public static Specification<Product> hasCategoryId(Integer categoryId) {
		return (root, query, cb) -> {
			query.distinct(true);
			return categoryId == null ? cb.conjunction() : cb.equal(root.get("category").get("id"), categoryId);
		};
	}

	public static Specification<Product> priceBetween(Long minPrice, Long maxPrice) {
		return (root, query, cb) -> {
			query.distinct(true);

			if (minPrice == null && maxPrice == null) {
				return cb.conjunction();
			}

			Subquery<Long> subquery = query.subquery(Long.class);
			Root<ProductVariant> variant = subquery.from(ProductVariant.class);

			CriteriaBuilder.Coalesce<Long> effectivePrice = cb.coalesce();
			effectivePrice.value(variant.get("salePrice"));
			effectivePrice.value(variant.get("rentPrice"));

			Predicate productMatch = cb.equal(variant.get("product"), root);
			Predicate pricePredicate = buildPricePredicate(cb, effectivePrice, minPrice, maxPrice);

			subquery.select(cb.literal(1L)).where(cb.and(productMatch, pricePredicate));
			return cb.exists(subquery);
		};
	}

	public static Specification<Product> sortBy(String sortBy, String sortDir) {
		return (root, query, cb) -> {
			if (isCountQuery(query)) {
				return cb.conjunction();
			}

			query.distinct(true);

			if (isPriceSort(sortBy)) {
				applyPriceSort(root, query, cb, sortDir);
			} else {
				query.orderBy(cb.desc(root.get("createdAt")), cb.desc(root.get("id")));
			}

			return cb.conjunction();
		};
	}

	private static void applyPriceSort(Root<Product> root, CriteriaQuery<?> query, CriteriaBuilder cb, String sortDir) {
		Subquery<Long> priceSubquery = query.subquery(Long.class);
		Root<ProductVariant> variant = priceSubquery.from(ProductVariant.class);

		CriteriaBuilder.Coalesce<Long> effectivePrice = cb.coalesce();
		effectivePrice.value(variant.get("salePrice"));
		effectivePrice.value(variant.get("rentPrice"));

		priceSubquery.select(cb.min(effectivePrice));
		priceSubquery.where(cb.equal(variant.get("product"), root));

		Order primaryOrder = isAscending(sortDir) ? cb.asc(priceSubquery) : cb.desc(priceSubquery);
		query.orderBy(primaryOrder, cb.desc(root.get("createdAt")), cb.desc(root.get("id")));
	}

	private static Predicate buildPricePredicate(CriteriaBuilder cb,
												 CriteriaBuilder.Coalesce<Long> effectivePrice,
												 Long minPrice,
												 Long maxPrice) {
		if (minPrice != null && maxPrice != null) {
			return cb.between(effectivePrice, minPrice, maxPrice);
		}
		if (minPrice != null) {
			return cb.greaterThanOrEqualTo(effectivePrice, minPrice);
		}
		return cb.lessThanOrEqualTo(effectivePrice, maxPrice);
	}

	private static boolean isPriceSort(String sortBy) {
		return "price".equalsIgnoreCase(sortBy);
	}

	private static boolean isAscending(String sortDir) {
		return "asc".equalsIgnoreCase(sortDir);
	}

	private static boolean isCountQuery(CriteriaQuery<?> query) {
		Class<?> resultType = query.getResultType();
		return Long.class.equals(resultType) || long.class.equals(resultType);
	}

	private static Predicate buildVariantKeywordMatch(Root<Product> root,
													  CriteriaQuery<?> query,
													  CriteriaBuilder cb,
													  String likePattern) {
		Subquery<Integer> subquery = query.subquery(Integer.class);
		Root<ProductVariant> variant = subquery.from(ProductVariant.class);

		Predicate productMatch = cb.equal(variant.get("product"), root);
		Predicate sizeMatch = cb.like(cb.lower(variant.get("size")), likePattern);
		Predicate colorMatch = cb.like(cb.lower(variant.get("color")), likePattern);

		subquery.select(cb.literal(1)).where(cb.and(productMatch, cb.or(sizeMatch, colorMatch)));
		return cb.exists(subquery);
	}

	private static String toLikePattern(String value) {
		return "%" + value.toLowerCase(Locale.ROOT).trim() + "%";
	}

	private static ProductType resolveProductType(String type) {
		if (type == null || type.isBlank()) {
			return null;
		}

		String normalized = normalize(type);
		return switch (normalized) {
			case "all", "tatca", "everything", "any" -> null;
			case "mua", "buy", "sell", "ban" -> ProductType.SELL;
			case "thue", "rent", "chothue" -> ProductType.RENT;
			case "datmay", "custom", "custommade", "made" -> ProductType.CUSTOM_MADE;
			default -> null;
		};
	}

	private static String normalize(String value) {
		String noDiacritics = Normalizer.normalize(value, Normalizer.Form.NFD)
				.replaceAll("\\p{M}+", "");
		return noDiacritics.toLowerCase(Locale.ROOT)
				.trim()
				.replaceAll("[\\s_-]+", "");
	}
}
