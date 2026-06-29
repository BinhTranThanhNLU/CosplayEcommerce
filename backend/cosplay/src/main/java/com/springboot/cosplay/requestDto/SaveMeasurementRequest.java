package com.springboot.cosplay.requestDto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SaveMeasurementRequest {

    @NotBlank(message = "Vui lòng nhập tên bộ số đo")
    private String profileName;

    @Positive(message = "Chiều cao phải là số dương")
    private BigDecimal height;

    @Positive(message = "Cân nặng phải là số dương")
    private BigDecimal weight;

    @Positive(message = "Vòng ngực phải là số dương")
    private BigDecimal bust;

    @Positive(message = "Vòng eo phải là số dương")
    private BigDecimal waist;

    @Positive(message = "Vòng mông phải là số dương")
    private BigDecimal hips;

    @Positive(message = "Vai rộng phải là số dương")
    private BigDecimal shoulder;
}
