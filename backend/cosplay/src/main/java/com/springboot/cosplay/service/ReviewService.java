package com.springboot.cosplay.service;

import com.springboot.cosplay.entity.Product;
import com.springboot.cosplay.entity.Review;
import com.springboot.cosplay.entity.User;
import com.springboot.cosplay.exception.BusinessException;
import com.springboot.cosplay.repository.ProductRepository;
import com.springboot.cosplay.repository.ReviewRepository;
import com.springboot.cosplay.requestDto.ReviewRequest;
import com.springboot.cosplay.responseDto.ReviewResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;

    public ReviewService(ReviewRepository reviewRepository, ProductRepository productRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
    }

    // ─── Thêm đánh giá mới ──────────────────────────────────────────────────
    @Transactional
    public ReviewResponse addReview(User user, ReviewRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new BusinessException("Không tìm thấy sản phẩm"));

        Review review = Review.builder()
                .user(user)
                .product(product)
                .rating(request.getRating())
                .comment(request.getComment())
                .createdAt(LocalDateTime.now())
                .build();

        Review savedReview = reviewRepository.save(review);

        return toReviewResponse(savedReview);
    }

    // ─── Lấy danh sách đánh giá theo sản phẩm ───────────────────────────────
    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsByProduct(Integer productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId)
                .stream()
                .map(this::toReviewResponse)
                .toList();
    }

    // ─── Mapper ─────────────────────────────────────────────────────────────
    private ReviewResponse toReviewResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .userId(review.getUser() != null ? review.getUser().getId() : null)
                .userName(review.getUser() != null ? review.getUser().getFullName() : "Khách hàng")
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}