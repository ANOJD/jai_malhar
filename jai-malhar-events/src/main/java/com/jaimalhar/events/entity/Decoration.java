package com.jaimalhar.events.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "decorations")
public class Decoration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String eventType;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String imageUrl;

    private Boolean available;

    public Decoration() {
    }

    public Decoration(Long id, String title, String eventType,
                      String description, String imageUrl, Boolean available) {
        this.id = id;
        this.title = title;
        this.eventType = eventType;
        this.description = description;
        this.imageUrl = imageUrl;
        this.available = available;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Boolean getAvailable() {
        return available;
    }

    public void setAvailable(Boolean available) {
        this.available = available;
    }
}