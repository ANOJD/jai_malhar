package com.jaimalhar.events.controller;

import com.jaimalhar.events.entity.Decoration;
import com.jaimalhar.events.service.DecorationService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/decorations")
public class DecorationController {

    private final DecorationService decorationService;

    public DecorationController(DecorationService decorationService) {
        this.decorationService = decorationService;
    }

    @PostMapping
    public Decoration saveDecoration(@RequestBody Decoration decoration) {
        return decorationService.saveDecoration(decoration);
    }

    @GetMapping
    public List<Decoration> getAllDecorations() {
        return decorationService.getAllDecorations();
    }

    @PutMapping("/{id}")
    public Decoration updateDecoration(
            @PathVariable Long id,
            @RequestBody Decoration decoration) {

        return decorationService.updateDecoration(id, decoration);
    }

    @DeleteMapping("/{id}")
    public void deleteDecoration(@PathVariable Long id) {
        decorationService.deleteDecoration(id);
    }

    @PostMapping("/{id}/images")
    public Decoration uploadDecorationImage(
            @PathVariable Long id,
            @RequestParam("image") MultipartFile image) {
        return decorationService.uploadDecorationImage(id, image);
    }
}
