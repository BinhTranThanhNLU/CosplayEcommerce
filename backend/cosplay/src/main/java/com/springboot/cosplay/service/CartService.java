package com.springboot.cosplay.service;

import com.springboot.cosplay.entity.*;
import com.springboot.cosplay.exception.BusinessException;
import com.springboot.cosplay.exception.ResourceNotFoundException;
import com.springboot.cosplay.repository.CartItemRepository;
import com.springboot.cosplay.repository.CartRepository;
import com.springboot.cosplay.repository.OrderRepository;
import com.springboot.cosplay.repository.ProductVariantRepository;
import com.springboot.cosplay.responseDto.CartItemResponse;
import com.springboot.cosplay.responseDto.CartResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductVariantRepository productVariantRepository;
    private final OrderRepository orderRepository;

    public CartService(CartRepository cartRepository,
                       CartItemRepository cartItemRepository,
                       ProductVariantRepository productVariantRepository,
                       OrderRepository orderRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productVariantRepository = productVariantRepository;
        this.orderRepository = orderRepository;
    }

    @Transactional
    public CartResponse getCart(User user) {
        Cart cart = getOrCreateCart(user);
        return toResponse(cart);
    }

    @Transactional
    public int getCartCount(User user) {
        Cart cart = getOrCreateCart(user);
        if (cart.getItems() == null) return 0;
        return cart.getItems().stream().mapToInt(item -> item.getQuantity() == null ? 0 : item.getQuantity()).sum();
    }

    @Transactional
    public CartResponse addToCart(User user, Integer productVariantId, Integer quantity, CartItemType itemType, Integer rentalDays) {
        if (productVariantId == null) throw new BusinessException("Vui lòng chọn phân loại sản phẩm");

        CartItemType safeType = itemType == null ? CartItemType.SELL : itemType;
        int safeQuantity = quantity == null || quantity < 1 ? 1 : quantity;
        int safeRentalDays = rentalDays == null || rentalDays < 1 ? 1 : rentalDays;

        Cart cart = getOrCreateCart(user);
        ProductVariant variant = productVariantRepository.findById(productVariantId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy biến thể sản phẩm"));

        validatePriceByType(variant, safeType);

        int stock = variant.getStock() == null ? 0 : variant.getStock();
        if (stock <= 0) throw new BusinessException("Sản phẩm đã hết hàng");

        CartItem item = findSameCartItem(cart, variant, safeType, safeType == CartItemType.RENT ? safeRentalDays : null);
        if (item == null) {
            item = CartItem.builder()
                    .cart(cart)
                    .productVariant(variant)
                    .quantity(0)
                    .itemType(safeType)
                    .rentalDays(safeType == CartItemType.RENT ? safeRentalDays : null)
                    .build();
        }

        int nextQuantity = (item.getQuantity() == null ? 0 : item.getQuantity()) + safeQuantity;
        if (nextQuantity > stock) throw new BusinessException("Số lượng trong giỏ hàng vượt quá tồn kho");

        boolean isNewItem = item.getId() == null;
        item.setQuantity(nextQuantity);
        CartItem savedItem = cartItemRepository.save(item);

        if (cart.getItems() == null) cart.setItems(new ArrayList<>());
        if (isNewItem) cart.getItems().add(savedItem);

        return toResponse(cart);
    }

    @Transactional
    public CartResponse updateQuantity(User user, Integer itemId, Integer quantity) {
        Cart cart = getOrCreateCart(user);
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm trong giỏ hàng"));

        if (!item.getCart().getId().equals(cart.getId())) throw new BusinessException("Bạn không có quyền chỉnh sửa sản phẩm này");

        int safeQuantity = quantity == null ? 1 : quantity;
        if (safeQuantity <= 0) {
            if (cart.getItems() != null) cart.getItems().remove(item);
            cartItemRepository.delete(item);
            return toResponse(cart);
        }

        int stock = item.getProductVariant().getStock() == null ? 0 : item.getProductVariant().getStock();
        if (safeQuantity > stock) throw new BusinessException("Số lượng trong giỏ hàng vượt quá tồn kho");

        item.setQuantity(safeQuantity);
        cartItemRepository.save(item);
        return toResponse(cart);
    }

    @Transactional
    public CartResponse removeItem(User user, Integer itemId) {
        Cart cart = getOrCreateCart(user);
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm trong giỏ hàng"));

        if (!item.getCart().getId().equals(cart.getId())) throw new BusinessException("Bạn không có quyền xóa sản phẩm này");
        if (cart.getItems() != null) cart.getItems().remove(item);
        cartItemRepository.delete(item);
        return toResponse(cart);
    }

    private CartItem findSameCartItem(Cart cart, ProductVariant variant, CartItemType type, Integer rentalDays) {
        if (cart.getItems() == null) return null;
        return cart.getItems().stream()
                .filter(item -> item.getProductVariant() != null && item.getProductVariant().getId().equals(variant.getId()))
                .filter(item -> resolveType(item) == type)
                .filter(item -> type != CartItemType.RENT || safeRentalDays(item).equals(rentalDays))
                .findFirst()
                .orElse(null);
    }

    private void validatePriceByType(ProductVariant variant, CartItemType type) {
        if (type == CartItemType.RENT) {
            if (variant.getRentPrice() == null || variant.getRentPrice() <= 0) throw new BusinessException("Sản phẩm này chưa có giá thuê");
        } else {
            if (variant.getSalePrice() == null || variant.getSalePrice() <= 0) throw new BusinessException("Sản phẩm này chưa có giá bán");
        }
    }

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUser(user).orElseGet(() -> cartRepository.save(Cart.builder().user(user).items(new ArrayList<>()).build()));
    }

    private CartResponse toResponse(Cart cart) {
        List<CartItemResponse> items = cart.getItems() == null ? List.of() : cart.getItems().stream().map(this::toItemResponse).toList();
        int totalQuantity = items.stream().mapToInt(CartItemResponse::getQuantity).sum();
        long totalAmount = items.stream().mapToLong(CartItemResponse::getLineTotal).sum();
        return CartResponse.builder().id(cart.getId()).items(items).totalQuantity(totalQuantity).totalAmount(totalAmount).build();
    }

    private CartItemResponse toItemResponse(CartItem item) {
        ProductVariant variant = item.getProductVariant();
        Product product = variant.getProduct();
        int quantity = safeQuantity(item);
        CartItemType type = resolveType(item);
        long price = getItemPrice(item);

        return CartItemResponse.builder()
                .id(item.getId())
                .productVariantId(variant.getId())
                .productId(product.getId())
                .productName(product.getName())
                .imageUrl(product.getImageUrl())
                .size(variant.getSize())
                .color(variant.getColor())
                .stock(variant.getStock())
                .quantity(quantity)
                .price(price)
                .salePrice(variant.getSalePrice())
                .rentPrice(variant.getRentPrice())
                .depositFee(variant.getDepositFee())
                .itemType(type.name())
                .rentalDays(type == CartItemType.RENT ? safeRentalDays(item) : null)
                .lineTotal(price * quantity)
                .build();
    }

    private int safeQuantity(CartItem item) { return item.getQuantity() == null ? 0 : item.getQuantity(); }
    private Integer safeRentalDays(CartItem item) { return item.getRentalDays() == null || item.getRentalDays() < 1 ? 1 : item.getRentalDays(); }
    private CartItemType resolveType(CartItem item) { return item.getItemType() == null ? CartItemType.SELL : item.getItemType(); }
    private long getItemPrice(CartItem item) {
        CartItemType type = resolveType(item);
        ProductVariant variant = item.getProductVariant();
        if (type == CartItemType.RENT) return (variant.getRentPrice() == null ? 0L : variant.getRentPrice()) * safeRentalDays(item);
        return variant.getSalePrice() == null ? 0L : variant.getSalePrice();
    }
}
