package com.jaimalhar.events.controller;

import com.jaimalhar.events.entity.BusinessSettings;
import com.jaimalhar.events.repository.BusinessSettingsRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    private final BusinessSettingsRepository settingsRepository;

    public SettingsController(BusinessSettingsRepository settingsRepository) {
        this.settingsRepository = settingsRepository;
    }

    @GetMapping
    public BusinessSettings getSettings() {
        BusinessSettings settings = settingsRepository.findById(1L).orElseGet(this::defaultSettings);
        normalizePhoneFields(settings);
        return settingsRepository.save(settings);
    }

    @PutMapping
    public BusinessSettings updateSettings(@RequestBody BusinessSettings settings) {
        BusinessSettings existing = settingsRepository.findById(1L).orElse(null);
        settings.setId(1L);
        if (isBlank(settings.getPrimaryPhone())) {
            settings.setPrimaryPhone(!isBlank(settings.getPhone())
                    ? settings.getPhone()
                    : existing == null ? null : existing.getPrimaryPhone());
        }
        if (settings.getSecondaryPhone() == null && existing != null) {
            settings.setSecondaryPhone(existing.getSecondaryPhone());
        }
        normalizePhoneFields(settings);
        return settingsRepository.save(settings);
    }

    private BusinessSettings defaultSettings() {
        BusinessSettings settings = new BusinessSettings();
        settings.setBusinessName("Jai Malhar Events & Decorations");
        settings.setPhone("+91 90198 26640");
        settings.setPrimaryPhone("+91 90198 26640");
        settings.setSecondaryPhone("");
        settings.setWhatsapp("+91 90198 26640");
        settings.setEmail("anojtd.24@gmail.com");
        settings.setAddress("Near Government School, Sonkera, Tq. Humnabad, Dist. Bidar, Karnataka");
        settings.setHours("24x7 Available");
        settings.setOwnerName("Sadanand Nelge");
        return settings;
    }

    private void normalizePhoneFields(BusinessSettings settings) {
        if (isBlank(settings.getPrimaryPhone())) {
            settings.setPrimaryPhone(settings.getPhone());
        }
        settings.setPhone(settings.getPrimaryPhone());
        if (settings.getSecondaryPhone() == null) {
            settings.setSecondaryPhone("");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
