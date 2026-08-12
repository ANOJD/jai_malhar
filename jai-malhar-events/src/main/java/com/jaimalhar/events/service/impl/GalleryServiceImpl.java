package com.jaimalhar.events.service.impl;

import com.jaimalhar.events.entity.Gallery;
import com.jaimalhar.events.repository.GalleryRepository;
import com.jaimalhar.events.service.GalleryService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class GalleryServiceImpl implements GalleryService {

    private final GalleryRepository galleryRepository;

    public GalleryServiceImpl(GalleryRepository galleryRepository) {
        this.galleryRepository = galleryRepository;
    }

    @Override
    public List<Gallery> getAllImages() {
        return galleryRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    public List<Gallery> uploadImages(String title, String category, List<MultipartFile> images) {
        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("An image title is required.");
        }
        if (images == null || images.isEmpty()) {
            throw new IllegalArgumentException("Select at least one image to upload.");
        }

        Path uploadsDir = Path.of("uploads");
        try {
            Files.createDirectories(uploadsDir);
            return images.stream()
                    .filter(image -> image != null && !image.isEmpty())
                    .map(image -> saveImage(title.trim(), category, image, uploadsDir))
                    .toList();
        } catch (IOException exception) {
            throw new RuntimeException("Failed to upload gallery image.", exception);
        }
    }

    private Gallery saveImage(String title, String category, MultipartFile image, Path uploadsDir) {
        if (image.getContentType() == null || !image.getContentType().startsWith("image/")) {
            throw new IllegalArgumentException("Only image files can be uploaded.");
        }

        String originalName = image.getOriginalFilename() == null ? "image" : image.getOriginalFilename();
        String filename = System.currentTimeMillis() + "-" + System.nanoTime() + "-"
                + originalName.replaceAll("[^a-zA-Z0-9._-]", "_");
        Path destination = uploadsDir.resolve(filename);

        try (InputStream inputStream = image.getInputStream()) {
            Files.copy(inputStream, destination, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException exception) {
            throw new RuntimeException("Failed to save gallery image.", exception);
        }

        Gallery galleryImage = new Gallery();
        galleryImage.setTitle(title);
        galleryImage.setCategory(category);
        galleryImage.setUrl("/uploads/" + filename);
        galleryImage.setCreatedAt(LocalDateTime.now());
        return galleryRepository.save(galleryImage);
    }

    @Override
    public void deleteImage(Long id) {
        galleryRepository.deleteById(id);
    }
}
