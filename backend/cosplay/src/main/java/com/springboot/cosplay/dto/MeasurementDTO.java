package com.springboot.cosplay.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MeasurementDTO {
    private Integer id;
    private String  profileName;
    private BigDecimal height;
    private BigDecimal weight;
    private BigDecimal bust;
    private BigDecimal waist;
    private BigDecimal hips;
    private BigDecimal shoulder;
    private LocalDateTime updatedAt;
}
