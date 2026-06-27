package com.springboot.cosplay.service;

import com.springboot.cosplay.dto.OrderDTO;
import com.springboot.cosplay.dto.OrderItemDTO;
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

    private final CartRepository     cartRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderRepository    orderRepository;
    private final VNPayService       vnPayService;

    public OrderService(CartRepository cartRepository,
                        CartItemRepository cartItemRepository,
                        OrderRepository orderRepository,
                        VNPayService vnPayService) {
        this.cartRepository     = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.orderRepository    = orderRepository;
        this.vnPayService       = vnPayService;
    }

    // ─── Lấy lịch sử đơn hàng của user ───────────────────────────────────────

    @Transactional(readOnly = true)
    public List<OrderDTO> getMyOrders(User user) {
        return orderRepository
                .findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::toOrderDTO)
                .toList();
    }

    // ─── Xử lý callback VNPay ─────────────────────────────────────────────────

    @Transactional
    public String handleVnPayReturn(Map<String, String> params) {
        String frontendUrl = "http://localhost:5173/payment-result";

        if (!vnPayService.verifySecureHash(params)) {
            return frontendUrl + "?status=failed&message=Invalid-Signature";
        }

        String vnp_TxnRef       = params.get("vnp_TxnRef");
        String vnp_ResponseCode = params.get("vnp_ResponseCode");

        Integer orderId;
        try {
            String[] parts = vnp_TxnRef.split("_");
            orderId = Integer.parseInt(parts[parts.length - 1]);
        } catch (Exception e) {
            return frontendUrl + "?status=failed&message=Invalid-TxnRef";
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new BusinessException("Không tìm thấy đơn hàng"));

        if ("00".equals(vnp_ResponseCode)) {
            order.setPaymentStatus(PaymentStatus.PAID);
            orderRepository.save(order);
            return frontendUrl + "?status=success&orderId=" + orderId;
        } else {
            order.setPaymentStatus(PaymentStatus.FAILED);
            order.setStatus(OrderStatus.CANCELLED);
            orderRepository.save(order);
            return frontendUrl + "?status=failed&orderId=" + orderId;
        }
    }

    // ─── Checkout ─────────────────────────────────────────────────────────────

    @Transactional
    public CheckoutResponse checkout(User user, CheckoutRequest request, String ipAddress) {
        Cart cart = getOrCreateCart(user);

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new BusinessException("Giỏ hàng đang trống");
        }
        if (request.getShippingAddress() == null || request.getShippingAddress().isBlank()) {
            throw new BusinessException("Vui lòng nhập địa chỉ giao hàng");
        }

        long total = cart.getItems().stream()
                .mapToLong(item -> getItemPrice(item) * safeQuantity(item))
                .sum();

        Shop shop = cart.getItems().get(0)
                .getProductVariant().getProduct().getShop();

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

        List<OrderItem> orderItems = cart.getItems().stream()
                .map(item -> OrderItem.builder()
                        .order(order)
                        .productVariant(item.getProductVariant())
                        .quantity(safeQuantity(item))
                        .price(getItemPrice(item))
                        .rental(false)
                        .build())
                .toList();

        order.setItems(new ArrayList<>(orderItems));

        Order saved = orderRepository.save(order);
        cartItemRepository.deleteByCart(cart);
        cart.getItems().clear();

        String paymentUrl = null;
        if (request.getPaymentMethod() == PaymentMethod.VNPAY) {
            paymentUrl = vnPayService.createOrderUrl(saved.getId(), saved.getTotalAmount(), ipAddress);
        }

        return CheckoutResponse.builder()
                .orderId(saved.getId())
                .totalAmount(saved.getTotalAmount())
                .status(saved.getStatus().name())
                .paymentUrl(paymentUrl)
                .build();
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUser(user)
                .orElseGet(() -> cartRepository.save(
                        Cart.builder().user(user).items(new ArrayList<>()).build()));
    }

    private int safeQuantity(CartItem item) {
        return item.getQuantity() == null ? 0 : item.getQuantity();
    }

    private long getItemPrice(CartItem item) {
        Long price = item.getProductVariant().getSalePrice();
        return price == null ? 0L : price;
    }

    // ─── Mapper ───────────────────────────────────────────────────────────────

    private OrderDTO toOrderDTO(Order order) {
        List<OrderItemDTO> itemDTOs = (order.getItems() == null ? List.<OrderItem>of() : order.getItems())
                .stream()
                .map(this::toOrderItemDTO)
                .toList();

        return OrderDTO.builder()
                .id(order.getId())
                .userId(order.getUserId())
                .customerName(order.getUser()  != null ? order.getUser().getFullName()  : null)
                .customerEmail(order.getUser() != null ? order.getUser().getEmail()     : null)
                .shopId(order.getShopId())
                .shopName(order.getShop()      != null ? order.getShop().getShopName()  : null)
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .shippingAddress(order.getShippingAddress())
                .createdAt(order.getCreatedAt())
                .items(itemDTOs)
                .build();
    }

    private OrderItemDTO toOrderItemDTO(OrderItem item) {
        ProductVariant variant = item.getProductVariant();
        Product product = variant != null ? variant.getProduct() : null;
        int  qty   = item.getQuantity() == null ? 0  : item.getQuantity();
        long price = item.getPrice()    == null ? 0L : item.getPrice();

        return OrderItemDTO.builder()
                .id(item.getId())
                .productVariantId(item.getProductVariantId())
                .productName(product != null ? product.getName()     : "(Không rõ)")
                .imageUrl(product    != null ? product.getImageUrl() : null)
                .size(variant        != null ? variant.getSize()     : null)
                .color(variant       != null ? variant.getColor()    : null)
                .quantity(qty)
                .price(price)
                .lineTotal(price * qty)
                .rental(Boolean.TRUE.equals(item.getRental()))
                .build();
    }
}
