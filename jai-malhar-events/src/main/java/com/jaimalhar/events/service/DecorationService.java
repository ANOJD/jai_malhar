package com.jaimalhar.events.service;

import com.jaimalhar.events.entity.Decoration;

import java.util.List;

public interface DecorationService {

    Decoration saveDecoration(Decoration decoration);

    List<Decoration> getAllDecorations();

    Decoration updateDecoration(Long id, Decoration decoration);

    Decoration uploadDecorationImage(Long id, org.springframework.web.multipart.MultipartFile image);

    void deleteDecoration(Long id);
}