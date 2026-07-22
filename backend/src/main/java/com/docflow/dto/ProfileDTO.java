package com.docflow.dto;

import java.time.LocalDateTime;

public class ProfileDTO {
    private Long id;
    private String name;
    private String email;
    private String role;
    private int ownedDocumentsCount;
    private int sharedDocumentsCount;
    private LocalDateTime createdAt;

    public ProfileDTO() {}

    public ProfileDTO(Long id, String name, String email, String role, int ownedDocumentsCount, int sharedDocumentsCount, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.ownedDocumentsCount = ownedDocumentsCount;
        this.sharedDocumentsCount = sharedDocumentsCount;
        this.createdAt = createdAt;
    }

    public static ProfileDTOBuilder builder() {
        return new ProfileDTOBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public int getOwnedDocumentsCount() { return ownedDocumentsCount; }
    public void setOwnedDocumentsCount(int ownedDocumentsCount) { this.ownedDocumentsCount = ownedDocumentsCount; }

    public int getSharedDocumentsCount() { return sharedDocumentsCount; }
    public void setSharedDocumentsCount(int sharedDocumentsCount) { this.sharedDocumentsCount = sharedDocumentsCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static class ProfileDTOBuilder {
        private Long id;
        private String name;
        private String email;
        private String role;
        private int ownedDocumentsCount;
        private int sharedDocumentsCount;
        private LocalDateTime createdAt;

        ProfileDTOBuilder() {}

        public ProfileDTOBuilder id(Long id) { this.id = id; return this; }
        public ProfileDTOBuilder name(String name) { this.name = name; return this; }
        public ProfileDTOBuilder email(String email) { this.email = email; return this; }
        public ProfileDTOBuilder role(String role) { this.role = role; return this; }
        public ProfileDTOBuilder ownedDocumentsCount(int ownedDocumentsCount) { this.ownedDocumentsCount = ownedDocumentsCount; return this; }
        public ProfileDTOBuilder sharedDocumentsCount(int sharedDocumentsCount) { this.sharedDocumentsCount = sharedDocumentsCount; return this; }
        public ProfileDTOBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public ProfileDTO build() {
            return new ProfileDTO(id, name, email, role, ownedDocumentsCount, sharedDocumentsCount, createdAt);
        }
    }
}
