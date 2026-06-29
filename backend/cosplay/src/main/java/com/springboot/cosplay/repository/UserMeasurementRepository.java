package com.springboot.cosplay.repository;

import com.springboot.cosplay.entity.UserMeasurement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserMeasurementRepository extends JpaRepository<UserMeasurement, Integer> {

    // Lấy tất cả số đo của user, sắp xếp mới nhất trước
    List<UserMeasurement> findByUserIdOrderByUpdatedAtDesc(Integer userId);

    // Tìm theo id và user_id (để kiểm tra ownership khi sửa/xóa)
    Optional<UserMeasurement> findByIdAndUserId(Integer id, Integer userId);
}
