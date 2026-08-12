package com.jaimalhar.events.service;

import com.jaimalhar.events.dto.BookingRequest;
import com.jaimalhar.events.entity.Booking;

import java.util.List;

public interface BookingService {

    Booking createBooking(BookingRequest request);

    List<Booking> getAllBookings();

    Booking updateBookingStatus(Long id, String status);

    void deleteBooking(Long id);
}