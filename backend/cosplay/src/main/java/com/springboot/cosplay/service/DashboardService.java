package com.springboot.cosplay.service;

import com.springboot.cosplay.dto.OrderDTO;
import com.springboot.cosplay.dto.OrderItemDTO;
import com.springboot.cosplay.entity.Order;
import com.springboot.cosplay.entity.OrderItem;
import com.springboot.cosplay.entity.OrderStatus;
import com.springboot.cosplay.entity.ProductVariant;
import com.springboot.cosplay.entity.UserRole;
import com.springboot.cosplay.entity.UserStatus;
import com.springboot.cosplay.repository.OrderRepository;
import com.springboot.cosplay.repository.UserRepository;
import com.springboot.cosplay.responseDto.DashboardStatsResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class DashboardService {

    private final UserRepository  userRepository;
    private final OrderRepository orderRepository;

    public DashboardService(UserRepository userRepository, OrderRepository orderRepository) {
        this.userRepository  = userRepository;
        this.orderRepository = orderRepository;
    }

    @Transactional(readOnly = true)
    public DashboardStatsResponse getStats() {
        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();

        // ── Users ──────────────────────────────────────────────────────────────
        long totalUsers     = userRepository.count();
        long newUsersToday  = userRepository.countByCreatedAtAfter(startOfToday);
        long totalSellers   = userRepository.countByRole(UserRole.SELLER);
        long totalCustomers = userRepository.countByRole(UserRole.CUSTOMER);
        long bannedUsers    = userRepository.countByStatus(UserStatus.BANNED);

        // ── Orders ─────────────────────────────────────────────────────────────
        long totalOrders      = orderRepository.count();
        long pendingOrders    = orderRepository.countByStatus(OrderStatus.PENDING);
        long processingOrders = orderRepository.countByStatus(OrderStatus.PROCESSING);
        long shippedOrders    = orderRepository.countByStatus(OrderStatus.SHIPPED);
        long completedOrders  = orderRepository.countByStatus(OrderStatus.COMPLETED);
        long cancelledOrders  = orderRepository.countByStatus(OrderStatus.CANCELLED);

        // ── Revenue ────────────────────────────────────────────────────────────
        long totalRevenue  = orderRepository.sumCompletedRevenue();
        long revenueToday  = orderRepository.sumCompletedRevenueAfter(startOfToday);

        // ── Recent orders ──────────────────────────────────────────────────────
        List<OrderDTO> recentOrders = orderRepository
                .findTop5ByOrderByCreatedAtDesc()
                .stream()
                .map(this::toOrderDTO)
                .toList();

        return DashboardStatsResponse.builder()
                .totalUsers(totalUsers)
                .newUsersToday(newUsersToday)
                .totalSellers(totalSellers)
                .totalCustomers(totalCustomers)
                .bannedUsers(bannedUsers)
                .totalOrders(totalOrders)
                .pendingOrders(pendingOrders)
                .processingOrders(processingOrders)
                .shippedOrders(shippedOrders)
                .completedOrders(completedOrders)
                .cancelledOrders(cancelledOrders)
                .totalRevenue(totalRevenue)
                .revenueToday(revenueToday)
                .recentOrders(recentOrders)
                .build();
    }

    // ─── Mapper ───────────────────────────────────────────────────────────────

    private OrderDTO toOrderDTO(Order order) {
        List<OrderItemDTO> items = order.getItems() == null ? List.of() :
                order.getItems().stream().map(this::toItemDTO).toList();

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
                .items(items)
                .build();
    }

    private OrderItemDTO toItemDTO(OrderItem item) {
        ProductVariant v = item.getProductVariant();
        String productName = (v != null && v.getProduct() != null) ? v.getProduct().getName()     : null;
        String imageUrl    = (v != null && v.getProduct() != null) ? v.getProduct().getImageUrl() : null;
        int    qty         = item.getQuantity() == null ? 0  : item.getQuantity();
        long   price       = item.getPrice()    == null ? 0L : item.getPrice();

        return OrderItemDTO.builder()
                .id(item.getId())
                .productVariantId(item.getProductVariantId())
                .productName(productName)
                .imageUrl(imageUrl)
                .size(v != null ? v.getSize()  : null)
                .color(v != null ? v.getColor() : null)
                .quantity(qty)
                .price(price)
                .lineTotal(price * qty)
                .rental(item.getRental())
                .build();
    }
}
