package com.springboot.cosplay.service;

import com.springboot.cosplay.dto.MeasurementDTO;
import com.springboot.cosplay.entity.User;
import com.springboot.cosplay.entity.UserMeasurement;
import com.springboot.cosplay.exception.BusinessException;
import com.springboot.cosplay.repository.UserMeasurementRepository;
import com.springboot.cosplay.repository.UserRepository;
import com.springboot.cosplay.requestDto.SaveMeasurementRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MeasurementService {

    private final UserMeasurementRepository measurementRepository;
    private final UserRepository userRepository;

    public MeasurementService(UserMeasurementRepository measurementRepository,
                               UserRepository userRepository) {
        this.measurementRepository = measurementRepository;
        this.userRepository = userRepository;
    }

    // ─── Lấy danh sách số đo của user hiện tại ───────────────────────────────

    @Transactional(readOnly = true)
    public List<MeasurementDTO> getMyMeasurements() {
        User user = getCurrentUser();
        return measurementRepository
                .findByUserIdOrderByUpdatedAtDesc(user.getId())
                .stream()
                .map(this::toDTO)
                .toList();
    }

    // ─── Tạo mới ─────────────────────────────────────────────────────────────

    @Transactional
    public MeasurementDTO createMeasurement(SaveMeasurementRequest request) {
        User user = getCurrentUser();

        UserMeasurement entity = UserMeasurement.builder()
                .user(user)
                .profileName(request.getProfileName().trim())
                .height(request.getHeight())
                .weight(request.getWeight())
                .bust(request.getBust())
                .waist(request.getWaist())
                .hips(request.getHips())
                .shoulder(request.getShoulder())
                .updatedAt(LocalDateTime.now())
                .build();

        return toDTO(measurementRepository.save(entity));
    }

    // ─── Cập nhật ─────────────────────────────────────────────────────────────

    @Transactional
    public MeasurementDTO updateMeasurement(Integer id, SaveMeasurementRequest request) {
        User user = getCurrentUser();

        UserMeasurement entity = measurementRepository
                .findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new BusinessException("Không tìm thấy bộ số đo hoặc bạn không có quyền sửa"));

        entity.setProfileName(request.getProfileName().trim());
        entity.setHeight(request.getHeight());
        entity.setWeight(request.getWeight());
        entity.setBust(request.getBust());
        entity.setWaist(request.getWaist());
        entity.setHips(request.getHips());
        entity.setShoulder(request.getShoulder());
        entity.setUpdatedAt(LocalDateTime.now());

        return toDTO(measurementRepository.save(entity));
    }

    // ─── Xóa ──────────────────────────────────────────────────────────────────

    @Transactional
    public void deleteMeasurement(Integer id) {
        User user = getCurrentUser();

        UserMeasurement entity = measurementRepository
                .findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new BusinessException("Không tìm thấy bộ số đo hoặc bạn không có quyền xóa"));

        measurementRepository.delete(entity);
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new BusinessException("Không tìm thấy tài khoản");
        }
        return user;
    }

    private MeasurementDTO toDTO(UserMeasurement entity) {
        return MeasurementDTO.builder()
                .id(entity.getId())
                .profileName(entity.getProfileName())
                .height(entity.getHeight())
                .weight(entity.getWeight())
                .bust(entity.getBust())
                .waist(entity.getWaist())
                .hips(entity.getHips())
                .shoulder(entity.getShoulder())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
