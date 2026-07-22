package com.docflow.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.util.List;

public class DocumentDTO {
    private Long id;
    private String title;
    private String content;
    private UserDTO owner;
    private List<UserDTO> sharedWith;

    @JsonProperty("isOwner")
    private boolean isOwner;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public DocumentDTO() {}

    public DocumentDTO(Long id, String title, String content, UserDTO owner, List<UserDTO> sharedWith, boolean isOwner, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.owner = owner;
        this.sharedWith = sharedWith;
        this.isOwner = isOwner;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static DocumentDTOBuilder builder() {
        return new DocumentDTOBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public UserDTO getOwner() { return owner; }
    public void setOwner(UserDTO owner) { this.owner = owner; }

    public List<UserDTO> getSharedWith() { return sharedWith; }
    public void setSharedWith(List<UserDTO> sharedWith) { this.sharedWith = sharedWith; }

    @JsonProperty("isOwner")
    public boolean isOwner() { return isOwner; }

    @JsonProperty("isOwner")
    public void setIsOwner(boolean isOwner) { this.isOwner = isOwner; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static class DocumentDTOBuilder {
        private Long id;
        private String title;
        private String content;
        private UserDTO owner;
        private List<UserDTO> sharedWith;
        private boolean isOwner;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        DocumentDTOBuilder() {}

        public DocumentDTOBuilder id(Long id) { this.id = id; return this; }
        public DocumentDTOBuilder title(String title) { this.title = title; return this; }
        public DocumentDTOBuilder content(String content) { this.content = content; return this; }
        public DocumentDTOBuilder owner(UserDTO owner) { this.owner = owner; return this; }
        public DocumentDTOBuilder sharedWith(List<UserDTO> sharedWith) { this.sharedWith = sharedWith; return this; }
        public DocumentDTOBuilder isOwner(boolean isOwner) { this.isOwner = isOwner; return this; }
        public DocumentDTOBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public DocumentDTOBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public DocumentDTO build() {
            return new DocumentDTO(id, title, content, owner, sharedWith, isOwner, createdAt, updatedAt);
        }
    }
}
