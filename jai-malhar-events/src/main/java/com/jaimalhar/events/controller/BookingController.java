package com.jaimalhar.events.controller;

import com.jaimalhar.events.entity.Booking;
import com.jaimalhar.events.service.BookingService;
import org.springframework.web.bind.annotation.*;
import com.jaimalhar.events.dto.BookingRequest;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public Booking createBooking(
            @Valid @RequestBody BookingRequest request) {

        return bookingService.createBooking(request);
    }

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @RequestMapping(value = "/{id}/status", method = {RequestMethod.PUT, RequestMethod.PATCH})
    public Booking updateBookingStatus(
            @PathVariable Long id,
            @RequestParam(required = false) String status,
            @RequestBody(required = false) Map<String, String> body) {
        String requestStatus = status;
        if (requestStatus == null && body != null) {
            requestStatus = body.get("status");
        }
        if (requestStatus == null || requestStatus.isBlank()) {
            throw new IllegalArgumentException("Required parameter 'status' is not present.");
        }
        System.out.println("[BookingController] updateBookingStatus called: id=" + id + ", status=" + requestStatus);
        return bookingService.updateBookingStatus(id, requestStatus);
    }

    @DeleteMapping("/{id}")
    public void deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
    }
}