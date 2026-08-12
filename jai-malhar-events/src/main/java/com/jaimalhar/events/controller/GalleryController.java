package com.jaimalhar.events.controller;

import com.jaimalhar.events.entity.Gallery;
import com.jaimalhar.events.service.GalleryService;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/gallery")
public class GalleryController {

    private final GalleryService galleryService;

    public GalleryController(GalleryService galleryService) {
        this.galleryService = galleryService;
    }

    @GetMapping
    public List<Gallery> getAllImages() {
        return galleryService.getAllImages();
    }

    @PostMapping("/upload")
    public List<Gallery> uploadImages(
            @RequestParam String title,
            @RequestParam String category,
            @RequestParam("images") List<MultipartFile> images) {
        return galleryService.uploadImages(title, category, images);
    }

    @DeleteMapping("/{id}")
    public void deleteImage(@PathVariable Long id) {
        galleryService.deleteImage(id);
    }
}
