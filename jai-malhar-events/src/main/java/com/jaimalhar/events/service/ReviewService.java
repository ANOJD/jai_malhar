package com.jaimalhar.events.service;

import com.jaimalhar.events.entity.Review;

import java.util.List;

public interface ReviewService {

    Review createReview(Review review);

    List<Review> getAllReviews();

    void deleteReview(Long id);
}