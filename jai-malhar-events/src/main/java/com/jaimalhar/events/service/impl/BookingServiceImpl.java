package com.jaimalhar.events.service.impl;

import com.jaimalhar.events.dto.BookingRequest;
import com.jaimalhar.events.entity.Booking;
import com.jaimalhar.events.entity.Decoration;
import com.jaimalhar.events.repository.BookingRepository;
import com.jaimalhar.events.repository.DecorationRepository;
import com.jaimalhar.events.service.BookingService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final DecorationRepository decorationRepository;

    public BookingServiceImpl(
            BookingRepository bookingRepository,
            DecorationRepository decorationRepository) {

        this.bookingRepository = bookingRepository;
        this.decorationRepository = decorationRepository;
    }

    @Override
    public Booking createBooking(BookingRequest request) {

        Decoration decoration = null;

        if (request.getDecorationId() != null) {
            decoration = decorationRepository
                    .findById(request.getDecorationId())
                    .orElseThrow(() ->
                            new RuntimeException("Decoration not found")
                    );
        }
        

        Booking booking = new Booking();

        booking.setCustomerName(request.getCustomerName());
        booking.setCustomerPhone(request.getCustomerPhone());
        booking.setCustomerEmail(request.getCustomerEmail());
        booking.setEventType(request.getEventType());
        booking.setEventDate(request.getEventDate());
        booking.setEventTime(request.getEventTime());
        booking.setVenue(request.getVenue());
        booking.setGuestCount(request.getGuestCount());
        booking.setLandmark(request.getLandmark());
        booking.setSpecialRequirement(request.getSpecialRequirement());
        booking.setDecoration(decoration);
        booking.setStatus("PENDING");

        return bookingRepository.save(booking);
    }

    @Override
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Override
    public Booking updateBookingStatus(Long id, String status) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found")
                );

        booking.setStatus(status);

        return bookingRepository.save(booking);
    }

        @Override
        public void deleteBooking(Long id) {
                Booking booking = bookingRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Booking not found"));
                bookingRepository.delete(booking);
        }
}