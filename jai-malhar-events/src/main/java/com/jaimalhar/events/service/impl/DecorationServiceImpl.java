package com.jaimalhar.events.service.impl;

import com.jaimalhar.events.entity.Decoration;
import com.jaimalhar.events.exception.DecorationInUseException;
import com.jaimalhar.events.repository.BookingRepository;
import com.jaimalhar.events.repository.DecorationRepository;
import com.jaimalhar.events.service.DecorationService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;

@Service
public class DecorationServiceImpl implements DecorationService {

    private final DecorationRepository decorationRepository;
    private final BookingRepository bookingRepository;

    public DecorationServiceImpl(
            DecorationRepository decorationRepository,
            BookingRepository bookingRepository) {
        this.decorationRepository = decorationRepository;
        this.bookingRepository = bookingRepository;
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
            Path uploadsDir = Path.of("uploads");
            if (!Files.exists(uploadsDir)) {
                Files.createDirectories(uploadsDir);
            }

            String filename = System.currentTimeMillis() + "-" + image.getOriginalFilename().replaceAll("[^a-zA-Z0-9._-]", "_");
            Path destination = uploadsDir.resolve(filename);
            try (InputStream inputStream = image.getInputStream()) {
                Files.copy(inputStream, destination, StandardCopyOption.REPLACE_EXISTING);
            }

            existing.setImageUrl("/uploads/" + filename);
            return decorationRepository.save(existing);
        } catch (IOException ex) {
            throw new RuntimeException("Failed to upload image.", ex);
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
                            + "Keep it unavailable instead to preserve booking history.");
        }

        decorationRepository.deleteById(id);
    }
}
