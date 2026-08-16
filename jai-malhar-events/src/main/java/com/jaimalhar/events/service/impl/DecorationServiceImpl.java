package com.jaimalhar.events.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.jaimalhar.events.entity.Decoration;
import com.jaimalhar.events.exception.DecorationInUseException;
import com.jaimalhar.events.repository.BookingRepository;
import com.jaimalhar.events.repository.DecorationRepository;
import com.jaimalhar.events.service.DecorationService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public class DecorationServiceImpl implements DecorationService {

    private final Cloudinary cloudinary;
    private final DecorationRepository decorationRepository;
    private final BookingRepository bookingRepository;

    public DecorationServiceImpl(
            DecorationRepository decorationRepository,
            BookingRepository bookingRepository,
            Cloudinary cloudinary) {

        this.decorationRepository = decorationRepository;
        this.bookingRepository = bookingRepository;
        this.cloudinary = cloudinary;
    }

    @Override
    public Decoration saveDecoration(Decoration decoration) {

        if (decoration.getAvailable() == null) {
            decoration.setAvailable(true);
        }

        return decorationRepository.save(decoration);
    }

    @Override
    public List<Decoration> getAllDecorations() {

        return decorationRepository.findAll();
    }

    @Override
    public Decoration updateDecoration(Long id, Decoration decoration) {

        Decoration existing = decorationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Decoration not found"));

        existing.setTitle(decoration.getTitle());
        existing.setEventType(decoration.getEventType());
        existing.setDescription(decoration.getDescription());
        existing.setImageUrl(decoration.getImageUrl());
        existing.setAvailable(decoration.getAvailable());

        return decorationRepository.save(existing);
    }

    @Override
    public Decoration uploadDecorationImage(Long id, MultipartFile image) {

        Decoration existing = decorationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Decoration not found"));

        if (image == null || image.isEmpty()) {
            throw new RuntimeException("No image file provided.");
        }

        try {
            Map<String, Object> uploadResult = cloudinary.uploader().upload(
                    image.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "jai-malhar/decorations"
                    )
            );

            String imageUrl = (String) uploadResult.get("secure_url");

            existing.setImageUrl(imageUrl);

            return decorationRepository.save(existing);

        } catch (IOException ex) {
            throw new RuntimeException(
                    "Failed to upload image to Cloudinary.",
                    ex
            );
        }
    }

    @Override
    public void deleteDecoration(Long id) {

        if (!decorationRepository.existsById(id)) {
            throw new RuntimeException("Decoration not found");
        }

        if (bookingRepository.existsByDecorationId(id)) {
            throw new DecorationInUseException(
                    "This decoration cannot be deleted because it is linked to existing bookings. "
                            + "Keep it unavailable instead to preserve booking history."
            );
        }

        decorationRepository.deleteById(id);
    }
}