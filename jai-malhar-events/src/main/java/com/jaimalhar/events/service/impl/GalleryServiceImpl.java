package com.jaimalhar.events.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.jaimalhar.events.entity.Gallery;
import com.jaimalhar.events.repository.GalleryRepository;
import com.jaimalhar.events.service.GalleryService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class GalleryServiceImpl implements GalleryService {

    private final GalleryRepository galleryRepository;
    private final Cloudinary cloudinary;

    public GalleryServiceImpl(
            GalleryRepository galleryRepository,
            Cloudinary cloudinary) {

        this.galleryRepository = galleryRepository;
        this.cloudinary = cloudinary;
    }

    @Override
    public List<Gallery> getAllImages() {
        return galleryRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    public List<Gallery> uploadImages(
            String title,
            String category,
            List<MultipartFile> images) {

        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("An image title is required.");
        }

        if (images == null || images.isEmpty()) {
            throw new IllegalArgumentException("Select at least one image to upload.");
        }

        return images.stream()
                .filter(image -> image != null && !image.isEmpty())
                .map(image -> saveImage(
                        title.trim(),
                        category,
                        image
                ))
                .toList();
    }

    private Gallery saveImage(
            String title,
            String category,
            MultipartFile image) {

        if (image.getContentType() == null
                || !image.getContentType().startsWith("image/")) {

            throw new IllegalArgumentException(
                    "Only image files can be uploaded."
            );
        }

        try {

            Map<String, Object> uploadResult =
                    cloudinary.uploader().upload(
                            image.getBytes(),
                            ObjectUtils.asMap(
                                    "folder",
                                    "jai-malhar/gallery"
                            )
                    );

            String imageUrl =
                    (String) uploadResult.get("secure_url");

            Gallery galleryImage = new Gallery();

            galleryImage.setTitle(title);
            galleryImage.setCategory(category);
            galleryImage.setUrl(imageUrl);
            galleryImage.setCreatedAt(LocalDateTime.now());

            return galleryRepository.save(galleryImage);

        } catch (IOException exception) {

            throw new RuntimeException(
                    "Failed to upload gallery image to Cloudinary.",
                    exception
            );
        }
    }

    @Override
    public void deleteImage(Long id) {
        galleryRepository.deleteById(id);
    }
}