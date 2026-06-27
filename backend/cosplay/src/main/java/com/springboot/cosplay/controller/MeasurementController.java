package com.springboot.cosplay.controller;

import com.springboot.cosplay.dto.MeasurementDTO;
import com.springboot.cosplay.requestDto.SaveMeasurementRequest;
import com.springboot.cosplay.service.MeasurementService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/measurements")
public class MeasurementController {

    private final MeasurementService measurementService;

    public MeasurementController(MeasurementService measurementService) {
        this.measurementService = measurementService;
    }

    // GET /api/measurements/my — Lấy tất cả số đo của user đang login
    @GetMapping("/my")
    public ResponseEntity<List<MeasurementDTO>> getMyMeasurements() {
        return ResponseEntity.ok(measurementService.getMyMeasurements());
    }

    // POST /api/measurements/my — Tạo bộ số đo mới
    @PostMapping("/my")
    public ResponseEntity<MeasurementDTO> createMeasurement(
            @Valid @RequestBody SaveMeasurementRequest request) {
        return ResponseEntity.ok(measurementService.createMeasurement(request));
    }

    // PUT /api/measurements/my/{id} — Cập nhật bộ số đo
    @PutMapping("/my/{id}")
    public ResponseEntity<MeasurementDTO> updateMeasurement(
            @PathVariable Integer id,
            @Valid @RequestBody SaveMeasurementRequest request) {
        return ResponseEntity.ok(measurementService.updateMeasurement(id, request));
    }

    // DELETE /api/measurements/my/{id} — Xóa bộ số đo
    @DeleteMapping("/my/{id}")
    public ResponseEntity<Void> deleteMeasurement(@PathVariable Integer id) {
        measurementService.deleteMeasurement(id);
        return ResponseEntity.noContent().build();
    }
}
