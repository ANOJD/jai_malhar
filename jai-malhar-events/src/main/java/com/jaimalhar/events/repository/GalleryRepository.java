package com.jaimalhar.events.repository;

import com.jaimalhar.events.entity.Gallery;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GalleryRepository extends JpaRepository<Gallery, Long> {

    List<Gallery> findAllByOrderByCreatedAtDesc();
}
