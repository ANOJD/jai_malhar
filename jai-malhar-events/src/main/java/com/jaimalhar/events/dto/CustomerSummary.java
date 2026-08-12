package com.jaimalhar.events.dto;

import java.time.LocalDate;

public record CustomerSummary(
        String id,
        String name,
        String phone,
        String email,
        long totalBookings,
        LocalDate lastBooking,
        String status) {
}
