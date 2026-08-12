package com.jaimalhar.events.service;

import com.jaimalhar.events.entity.Gallery;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface GalleryService {

    List<Gallery> getAllImages();

    List<Gallery> uploadImages(String title, String category, List<MultipartFile> images);

    void deleteImage(Long id);
}
