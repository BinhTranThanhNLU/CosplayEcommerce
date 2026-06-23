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

    // Thêm hàm này vào OrderService.java
    @Transactional
    public String handleVnPayReturn(Map<String, String> params) {
        // Đường dẫn gốc của Frontend React (sửa lại nếu port của bạn khác)
        String frontendUrl = "http://localhost:5173/payment-result";

        // 1. Kiểm tra chữ ký bảo mật
        if (!vnPayService.verifySecureHash(params)) {
            return frontendUrl + "?status=failed&message=Invalid-Signature";
        }

        // 2. Lấy thông tin từ params
        String vnp_TxnRef = params.get("vnp_TxnRef");
        String vnp_ResponseCode = params.get("vnp_ResponseCode");

        // Tách lấy Order ID (vì lúc tạo url mình ghép format: random_orderId)
        Integer orderId;
        try {
            String[] txnRefParts = vnp_TxnRef.split("_");
            orderId = Integer.parseInt(txnRefParts[txnRefParts.length - 1]);
        } catch (Exception e) {
            return frontendUrl + "?status=failed&message=Invalid-TxnRef";
        }

        // 3. Tìm đơn hàng
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new BusinessException("Không tìm thấy đơn hàng"));

        // 4. Kiểm tra mã phản hồi và cập nhật trạng thái
        if ("00".equals(vnp_ResponseCode)) {
            // Thanh toán thành công
            order.setPaymentStatus(PaymentStatus.PAID);
            orderRepository.save(order);

            return frontendUrl + "?status=success&orderId=" + orderId;
        } else {
            // Thanh toán thất bại hoặc người dùng bấm Hủy
            order.setPaymentStatus(PaymentStatus.FAILED);
            order.setStatus(OrderStatus.CANCELLED); // Hủy luôn đơn giao hàng
            orderRepository.save(order);

            return frontendUrl + "?status=failed&orderId=" + orderId;
        }
    }

    @Transactional
    public CheckoutResponse checkout(User user, CheckoutRequest request, String ipAddress) {
        Cart cart = getOrCreateCart(user);

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new BusinessException("Giỏ hàng đang trống");
        }

        if (request.getShippingAddress() == null || request.getShippingAddress().trim().isEmpty()) {
            throw new BusinessException("Vui lòng nhập địa chỉ giao hàng");
        }

        Long total = cart.getItems()
                .stream()
                .mapToLong(item -> getItemPrice(item) * safeQuantity(item))
                .sum();

        Shop shop = cart.getItems()
                .get(0)
                .getProductVariant()
                .getProduct()
                .getShop();

        Order order = Order.builder()
                .user(user)
                .shop(shop)
                .totalAmount(total)
                .status(OrderStatus.PENDING) // Trạng thái giao hàng
                .shippingAddress(request.getShippingAddress().trim())
                .paymentMethod(request.getPaymentMethod())  // Lưu COD hoặc VNPAY
                .paymentStatus(PaymentStatus.UNPAID) // Mặc định khởi tạo là chưa trả tiền
                .createdAt(LocalDateTime.now())
                .build();

        List<OrderItem> orderItems = cart.getItems()
                .stream()
                .map(item -> OrderItem.builder()
                        .order(order)
                        .productVariant(item.getProductVariant())
                        .quantity(safeQuantity(item))
                        .price(getItemPrice(item))
                        .rental(false)
                        .build())
                .toList();

        if (order.getItems() == null) {
            order.setItems(new ArrayList<>());
        }

        order.getItems().addAll(orderItems);

        Order savedOrder = orderRepository.save(order);

        cartItemRepository.deleteByCart(cart);

        cart.getItems().clear();

        // Xử lý tạo URL thanh toán
        String paymentUrl = null;
        if (request.getPaymentMethod() == PaymentMethod.VNPAY) {
            paymentUrl = vnPayService.createOrderUrl(savedOrder.getId(), savedOrder.getTotalAmount(), ipAddress);
        }

        return CheckoutResponse.builder()
                .orderId(savedOrder.getId())
                .totalAmount(savedOrder.getTotalAmount())
                .status(savedOrder.getStatus().name())
                .paymentUrl(paymentUrl) // Trả về link hoặc null
                .build();
    }

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart cart = Cart.builder()
                            .user(user)
                            .items(new ArrayList<>())
                            .build();

                    return cartRepository.save(cart);
                });
    }

    private int safeQuantity(CartItem item) {
        return item.getQuantity() == null ? 0 : item.getQuantity();
    }

    private long getItemPrice(CartItem item) {
        Long price = item.getProductVariant().getSalePrice();
        return price == null ? 0L : price;
    }


}
