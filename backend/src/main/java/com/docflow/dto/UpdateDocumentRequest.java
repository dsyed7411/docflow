package com.docflow.dto;

import jakarta.validation.constraints.NotBlank;

public class UpdateDocumentRequest {

    @NotBlank(message = "Title cannot be empty")
    private String title;

    private String content;

    public UpdateDocumentRequest() {}

    public UpdateDocumentRequest(String title, String content) {
        this.title = title;
        this.content = content;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
