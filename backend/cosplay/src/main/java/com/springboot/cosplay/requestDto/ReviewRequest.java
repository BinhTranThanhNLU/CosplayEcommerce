package com.springboot.cosplay.requestDto;

import lombok.Data;

@Data
public class ReviewRequest {

    private Integer productId;
    private Integer rating;
    private String comment;

}
