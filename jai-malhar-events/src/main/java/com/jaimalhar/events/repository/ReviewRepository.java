package com.jaimalhar.events.repository;

import com.jaimalhar.events.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {
}