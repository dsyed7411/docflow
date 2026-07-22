package com.docflow.dto;

import jakarta.validation.constraints.NotBlank;

public class UploadDocumentRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String content;

    private String fileName;

    public UploadDocumentRequest() {}

    public UploadDocumentRequest(String title, String content, String fileName) {
        this.title = title;
        this.content = content;
        this.fileName = fileName;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
}
