package com.springboot.cosplay.responseDto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ReviewResponse {
    private Integer id;
    private Integer userId;
    private String userName;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
}
