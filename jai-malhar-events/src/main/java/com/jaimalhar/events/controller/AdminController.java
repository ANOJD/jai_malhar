package com.jaimalhar.events.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Value;
import jakarta.annotation.PostConstruct;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping({"/api/admin", "/api/auth/admin"})
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://127.0.0.1:5173"
})
public class AdminController {

    @Value("${admin.username}")
    private String adminUsername;

    @Value("${admin.password}")
    private String adminPassword;

    @PostConstruct
    void validateAdminCredentials() {
        if (adminUsername == null || adminUsername.isBlank()
                || adminPassword == null || adminPassword.isBlank()) {
            throw new IllegalStateException(
                    "Admin credentials are not configured. Set ADMIN_USERNAME and ADMIN_PASSWORD.");
        }
    }

    @PostMapping("/login")
    public Map<String, Object> login(
            @RequestBody Map<String, String> credentials) {

        String username = credentials.get("username");
        String password = credentials.get("password");

        if (adminUsername.equals(username)
                && adminPassword.equals(password)) {

            Map<String, Object> user = new HashMap<>();
            user.put("username", adminUsername);
            user.put("role", "ADMIN");

            Map<String, Object> response = new HashMap<>();
            response.put("token", "demo-admin-token");
            response.put("user", user);

            return response;
        }

        throw new RuntimeException("Invalid username or password");
    }

    @PostMapping("/logout")
    public Map<String, String> logout() {
        return Map.of("message", "Admin logged out successfully");
    }
}
