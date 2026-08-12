package com.jaimalhar.events.repository;

import com.jaimalhar.events.entity.Booking;
import com.jaimalhar.events.entity.Decoration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    boolean existsByDecorationId(Long decorationId);

    boolean existsByDecorationAndEventDate(
            Decoration decoration,
            LocalDate eventDate
    );
}
