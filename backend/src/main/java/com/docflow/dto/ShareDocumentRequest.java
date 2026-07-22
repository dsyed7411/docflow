package com.docflow.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ShareDocumentRequest {

    @NotNull(message = "Document ID is required")
    private Long documentId;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    public ShareDocumentRequest() {}

    public ShareDocumentRequest(Long documentId, String email) {
        this.documentId = documentId;
        this.email = email;
    }

    public Long getDocumentId() { return documentId; }
    public void setDocumentId(Long documentId) { this.documentId = documentId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
