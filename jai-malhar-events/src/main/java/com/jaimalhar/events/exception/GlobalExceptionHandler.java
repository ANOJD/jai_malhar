package com.jaimalhar.events.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BookingConflictException.class)
    public ResponseEntity<Map<String, Object>> handleBookingConflict(
            BookingConflictException exception) {

        return conflictResponse(exception.getMessage());
    }

    @ExceptionHandler(DecorationInUseException.class)
    public ResponseEntity<Map<String, Object>> handleDecorationInUse(
            DecorationInUseException exception) {

        return conflictResponse(exception.getMessage());
    }

    private ResponseEntity<Map<String, Object>> conflictResponse(String message) {

        Map<String, Object> response = new HashMap<>();

        response.put("status", 409);
        response.put("message", message);
        response.put("timestamp", LocalDateTime.now());

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(response);
    }
}
