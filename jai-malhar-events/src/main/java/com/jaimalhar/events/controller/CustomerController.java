package com.jaimalhar.events.controller;

import com.jaimalhar.events.dto.CustomerSummary;
import com.jaimalhar.events.entity.Booking;
import com.jaimalhar.events.repository.BookingRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final BookingRepository bookingRepository;

    public CustomerController(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    @GetMapping
    public List<CustomerSummary> getCustomers() {
        Map<String, List<Booking>> bookingsByCustomer = new LinkedHashMap<>();
        for (Booking booking : bookingRepository.findAll()) {
            String key = customerKey(booking);
            bookingsByCustomer.computeIfAbsent(key, ignored -> new java.util.ArrayList<>()).add(booking);
        }

        return bookingsByCustomer.entrySet().stream()
                .map(entry -> toSummary(entry.getKey(), entry.getValue()))
                .sorted(Comparator.comparing(CustomerSummary::lastBooking,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .toList();
    }

    private CustomerSummary toSummary(String id, List<Booking> bookings) {
        Booking latest = bookings.stream()
                .max(Comparator.comparing(Booking::getEventDate, Comparator.nullsLast(Comparator.naturalOrder())))
                .orElseThrow();
        boolean hasActiveBooking = bookings.stream()
                .anyMatch(booking -> !"cancelled".equalsIgnoreCase(booking.getStatus()));

        return new CustomerSummary(
                id,
                latest.getCustomerName(),
                latest.getCustomerPhone(),
                latest.getCustomerEmail(),
                bookings.size(),
                latest.getEventDate(),
                hasActiveBooking ? "active" : "inactive");
    }

    private String customerKey(Booking booking) {
        if (booking.getCustomerPhone() != null && !booking.getCustomerPhone().isBlank()) {
            return booking.getCustomerPhone();
        }
        if (booking.getCustomerEmail() != null && !booking.getCustomerEmail().isBlank()) {
            return booking.getCustomerEmail();
        }
        return "booking-" + booking.getId();
    }
}
