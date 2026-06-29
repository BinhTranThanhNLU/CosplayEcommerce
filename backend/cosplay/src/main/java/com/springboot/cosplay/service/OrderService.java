package com.springboot.cosplay.service;

import com.springboot.cosplay.entity.*;
import com.springboot.cosplay.exception.BusinessException;
import com.springboot.cosplay.repository.CartItemRepository;
import com.springboot.cosplay.repository.CartRepository;
import com.springboot.cosplay.repository.OrderRepository;
import com.springboot.cosplay.requestDto.CheckoutRequest;
import com.springboot.cosplay.responseDto.CheckoutResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class OrderService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderRepository orderRepository;
    private final VNPayService vnPayService;

    public OrderService(CartRepository cartRepository,
                        CartItemRepository cartItemRepository,
                        OrderRepository orderRepository,
                        VNPayService vnPayService) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.orderRepository = orderRepository;
        this.vnPayService = vnPayService;
    }

    @Transactional
    public String handleVnPayReturn(Map<String, String> params) {
        String frontendUrl = "http://localhost:5173/payment-result";

        if (!vnPayService.verifySecureHash(params)) return frontendUrl + "?status=failed&message=Invalid-Signature";

        String vnp_TxnRef = params.get("vnp_TxnRef");
        String vnp_ResponseCode = params.get("vnp_ResponseCode");

        Integer orderId;
        try {
            String[] txnRefParts = vnp_TxnRef.split("_");
            orderId = Integer.parseInt(txnRefParts[txnRefParts.length - 1]);
        } catch (Exception e) {
            return frontendUrl + "?status=failed&message=Invalid-TxnRef";
        }

        Order order = orderRepository.findById(orderId).orElseThrow(() -> new BusinessException("Không tìm thấy đơn hàng"));

        if ("00".equals(vnp_ResponseCode)) {
            order.setPaymentStatus(PaymentStatus.PAID);
            orderRepository.save(order);
            return frontendUrl + "?status=success&orderId=" + orderId;
        }

        order.setPaymentStatus(PaymentStatus.FAILED);
        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
        return frontendUrl + "?status=failed&orderId=" + orderId;
    }

    @Transactional
    public CheckoutResponse checkout(User user, CheckoutRequest request, String ipAddress) {
        Cart cart = getOrCreateCart(user);
        List<CartItem> checkoutItems = resolveCheckoutItems(cart, request.getSelectedCartItemIds());

        if (checkoutItems.isEmpty()) throw new BusinessException("Giỏ hàng đang trống");
        if (request.getShippingAddress() == null || request.getShippingAddress().trim().isEmpty()) throw new BusinessException("Vui lòng nhập địa chỉ giao hàng");

        boolean hasRent = checkoutItems.stream().anyMatch(item -> resolveType(item) == CartItemType.RENT);
        boolean hasSell = checkoutItems.stream().anyMatch(item -> resolveType(item) == CartItemType.SELL);
        if (hasRent && hasSell) throw new BusinessException("Vui lòng thanh toán đơn thuê và đơn mua riêng");

        Long total = checkoutItems.stream().mapToLong(item -> getItemPrice(item) * safeQuantity(item)).sum();

        Shop shop = checkoutItems.get(0).getProductVariant().getProduct().getShop();

        Order order = Order.builder()
                .user(user)
                .shop(shop)
                .totalAmount(total)
                .status(OrderStatus.PENDING)
                .shippingAddress(request.getShippingAddress().trim())
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus(PaymentStatus.UNPAID)
                .createdAt(LocalDateTime.now())
                .build();

        List<OrderItem> orderItems = checkoutItems.stream().map(item -> OrderItem.builder()
                .order(order)
                .productVariant(item.getProductVariant())
                .quantity(safeQuantity(item))
                .price(getItemPrice(item))
                .rental(resolveType(item) == CartItemType.RENT)
                .build()).toList();

        if (order.getItems() == null) order.setItems(new ArrayList<>());
        order.getItems().addAll(orderItems);

        Order savedOrder = orderRepository.save(order);

        checkoutItems.forEach(item -> {
            if (cart.getItems() != null) cart.getItems().remove(item);
            cartItemRepository.delete(item);
        });

        String paymentUrl = null;
        if (request.getPaymentMethod() == PaymentMethod.VNPAY) {
            paymentUrl = vnPayService.createOrderUrl(savedOrder.getId(), savedOrder.getTotalAmount(), ipAddress);
        }

        return CheckoutResponse.builder()
                .orderId(savedOrder.getId())
                .totalAmount(savedOrder.getTotalAmount())
                .status(savedOrder.getStatus().name())
                .paymentUrl(paymentUrl)
                .build();
    }

    private List<CartItem> resolveCheckoutItems(Cart cart, List<Integer> selectedCartItemIds) {
        List<CartItem> items = cart.getItems() == null ? List.of() : cart.getItems();
        if (selectedCartItemIds == null || selectedCartItemIds.isEmpty()) return new ArrayList<>(items);
        return items.stream().filter(item -> selectedCartItemIds.contains(item.getId())).toList();
    }

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUser(user).orElseGet(() -> cartRepository.save(Cart.builder().user(user).items(new ArrayList<>()).build()));
    }

    private int safeQuantity(CartItem item) { return item.getQuantity() == null ? 0 : item.getQuantity(); }
    private Integer safeRentalDays(CartItem item) { return item.getRentalDays() == null || item.getRentalDays() < 1 ? 1 : item.getRentalDays(); }
    private CartItemType resolveType(CartItem item) { return item.getItemType() == null ? CartItemType.SELL : item.getItemType(); }
    private long getItemPrice(CartItem item) {
        ProductVariant variant = item.getProductVariant();
        if (resolveType(item) == CartItemType.RENT) return (variant.getRentPrice() == null ? 0L : variant.getRentPrice()) * safeRentalDays(item);
        return variant.getSalePrice() == null ? 0L : variant.getSalePrice();
    }
}
