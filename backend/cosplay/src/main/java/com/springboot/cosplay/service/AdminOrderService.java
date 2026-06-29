package com.springboot.cosplay.service;

import com.springboot.cosplay.dto.OrderDTO;
import com.springboot.cosplay.dto.OrderItemDTO;
import com.springboot.cosplay.entity.Order;
import com.springboot.cosplay.entity.OrderItem;
import com.springboot.cosplay.entity.OrderStatus;
import com.springboot.cosplay.entity.ProductVariant;
import com.springboot.cosplay.exception.ResourceNotFoundException;
import com.springboot.cosplay.repository.OrderRepository;
import com.springboot.cosplay.requestDto.UpdateOrderStatusRequest;
import com.springboot.cosplay.responseDto.OrderPageResponse;
import com.springboot.cosplay.responseDto.OrderStatsResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;

@Service
public class AdminOrderService {

    private final OrderRepository orderRepository;

    public AdminOrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    // ─── Lấy danh sách đơn hàng (phân trang + lọc) ────────────────────────────

    @Transactional(readOnly = true)
    public OrderPageResponse getAllOrders(String keyword, String status, int page, int size) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.max(size, 1);

        Pageable pageable = PageRequest.of(safePage, safeSize,
                Sort.by(Sort.Direction.DESC, "createdAt"));

        OrderStatus orderStatus = resolveStatus(status);
        String kw = (keyword == null || keyword.isBlank()) ? null : keyword.trim();

        Page<Order> pageResult = orderRepository.searchOrders(kw, orderStatus, pageable);
        List<OrderDTO> dtos = pageResult.getContent().stream().map(this::toDTO).toList();

        return OrderPageResponse.builder()
                .orders(dtos)
                .currentPage(pageResult.getNumber())
                .totalPages(pageResult.getTotalPages())
                .totalItems(pageResult.getTotalElements())
                .build();
    }

    // ─── Lấy chi tiết 1 đơn ────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public OrderDTO getOrderById(Integer id) {
        return toDTO(findOrThrow(id));
    }

    // ─── Cập nhật trạng thái ──────────────────────────────────────────────────

    @Transactional
    public OrderDTO updateStatus(Integer id, UpdateOrderStatusRequest request) {
        Order order = findOrThrow(id);
        OrderStatus newStatus = resolveStatusStrict(request.getStatus());
        order.setStatus(newStatus);
        return toDTO(orderRepository.save(order));
    }

    // ─── Thống kê ─────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public OrderStatsResponse getStats() {
        long total       = orderRepository.count();
        long pending     = orderRepository.countByStatus(OrderStatus.PENDING);
        long processing  = orderRepository.countByStatus(OrderStatus.PROCESSING);
        long shipped     = orderRepository.countByStatus(OrderStatus.SHIPPED);
        long completed   = orderRepository.countByStatus(OrderStatus.COMPLETED);
        long cancelled   = orderRepository.countByStatus(OrderStatus.CANCELLED);
        long revenue     = orderRepository.sumCompletedRevenue();

        return OrderStatsResponse.builder()
                .totalOrders(total)
                .pendingOrders(pending)
                .processingOrders(processing)
                .shippedOrders(shipped)
                .completedOrders(completed)
                .cancelledOrders(cancelled)
                .totalRevenue(revenue)
                .build();
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    private Order findOrThrow(Integer id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng với id: " + id));
    }

    private OrderDTO toDTO(Order order) {
        List<OrderItemDTO> itemDTOs = order.getItems() == null ? List.of() :
                order.getItems().stream().map(this::toItemDTO).toList();

        String customerName  = order.getUser()  != null ? order.getUser().getFullName()  : null;
        String customerEmail = order.getUser()  != null ? order.getUser().getEmail()      : null;
        String shopName      = order.getShop()  != null ? order.getShop().getShopName()  : null;

        return OrderDTO.builder()
                .id(order.getId())
                .userId(order.getUserId())
                .customerName(customerName)
                .customerEmail(customerEmail)
                .shopId(order.getShopId())
                .shopName(shopName)
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .shippingAddress(order.getShippingAddress())
                .createdAt(order.getCreatedAt())
                .items(itemDTOs)
                .build();
    }

    private OrderItemDTO toItemDTO(OrderItem item) {
        ProductVariant v = item.getProductVariant();
        String productName = (v != null && v.getProduct() != null) ? v.getProduct().getName()    : null;
        String imageUrl    = (v != null && v.getProduct() != null) ? v.getProduct().getImageUrl() : null;
        String size        = v != null ? v.getSize()  : null;
        String color       = v != null ? v.getColor() : null;
        int qty   = item.getQuantity() == null ? 0 : item.getQuantity();
        long price = item.getPrice()   == null ? 0L : item.getPrice();

        return OrderItemDTO.builder()
                .id(item.getId())
                .productVariantId(item.getProductVariantId())
                .productName(productName)
                .imageUrl(imageUrl)
                .size(size)
                .color(color)
                .quantity(qty)
                .price(price)
                .lineTotal(price * qty)
                .rental(item.getRental())
                .build();
    }

    private OrderStatus resolveStatus(String value) {
        if (value == null || value.isBlank() || "all".equalsIgnoreCase(value)) return null;
        try {
            return OrderStatus.valueOf(value.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    private OrderStatus resolveStatusStrict(String value) {
        try {
            return OrderStatus.valueOf(value.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Trạng thái không hợp lệ: " + value);
        }
    }
}