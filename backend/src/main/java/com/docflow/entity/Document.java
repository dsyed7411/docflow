package com.docflow.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "documents")
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public Document() {
    }

    public Document(Long id, String title, String content, User owner, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.owner = owner;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static DocumentBuilder builder() {
        return new DocumentBuilder();
    }

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        if (createdAt == null) {
            createdAt = now;
        }
        if (updatedAt == null) {
            updatedAt = now;
        }
        if (content == null) {
            content = "{\"type\":\"doc\",\"content\":[{\"type\":\"paragraph\",\"content\":[]}]}";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static class DocumentBuilder {
        private Long id;
        private String title;
        private String content;
        private User owner;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        DocumentBuilder() {}

        public DocumentBuilder id(Long id) { this.id = id; return this; }
        public DocumentBuilder title(String title) { this.title = title; return this; }
        public DocumentBuilder content(String content) { this.content = content; return this; }
        public DocumentBuilder owner(User owner) { this.owner = owner; return this; }
        public DocumentBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public DocumentBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Document build() {
            return new Document(id, title, content, owner, createdAt, updatedAt);
        }
    }
}
