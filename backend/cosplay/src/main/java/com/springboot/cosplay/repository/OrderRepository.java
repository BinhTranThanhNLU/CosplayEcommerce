package com.springboot.cosplay.repository;

import com.springboot.cosplay.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Integer> {
}
