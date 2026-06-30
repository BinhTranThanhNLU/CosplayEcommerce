package com.springboot.cosplay.controller;

import com.springboot.cosplay.entity.User;
import com.springboot.cosplay.requestDto.ReviewRequest;
import com.springboot.cosplay.responseDto.ReviewResponse;
import com.springboot.cosplay.security.UserDetailsImpl;
import com.springboot.cosplay.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewResponse>> getProductReviews(@PathVariable Integer productId) {
        return ResponseEntity.ok(reviewService.getReviewsByProduct(productId));
    }

    @PostMapping
    public ResponseEntity<ReviewResponse> addReview(
            @AuthenticationPrincipal UserDetailsImpl principal,
            @RequestBody ReviewRequest request) {

        User currentUser = principal.getUser();
        return ResponseEntity.ok(reviewService.addReview(currentUser, request));
    }
}