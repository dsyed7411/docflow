package com.docflow.controller;

import com.docflow.dto.*;
import com.docflow.security.UserPrincipal;
import com.docflow.service.DocumentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @GetMapping("/documents")
    public ResponseEntity<List<DocumentDTO>> getAllDocuments(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "filter", required = false) String filter) {
        if ("owned".equalsIgnoreCase(filter)) {
            return ResponseEntity.ok(documentService.getOwnedDocuments(currentUser));
        } else if ("shared".equalsIgnoreCase(filter)) {
            return ResponseEntity.ok(documentService.getSharedDocuments(currentUser));
        }
        return ResponseEntity.ok(documentService.searchDocuments(currentUser, search));
    }

    @GetMapping("/shared")
    public ResponseEntity<List<DocumentDTO>> getSharedDocuments(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(documentService.getSharedDocuments(currentUser));
    }

    @GetMapping("/documents/{id}")
    public ResponseEntity<DocumentDTO> getDocumentById(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(documentService.getDocumentById(id, currentUser));
    }

    @PostMapping("/documents")
    public ResponseEntity<DocumentDTO> createDocument(
            @Valid @RequestBody CreateDocumentRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        DocumentDTO created = documentService.createDocument(request, currentUser);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/documents/{id}")
    public ResponseEntity<DocumentDTO> updateDocument(
            @PathVariable("id") Long id,
            @Valid @RequestBody UpdateDocumentRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        DocumentDTO updated = documentService.updateDocument(id, request, currentUser);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/documents/{id}")
    public ResponseEntity<Void> deleteDocument(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        documentService.deleteDocument(id, currentUser);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/documents/upload")
    public ResponseEntity<DocumentDTO> uploadDocument(
            @Valid @RequestBody UploadDocumentRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        DocumentDTO uploaded = documentService.uploadDocument(request, currentUser);
        return new ResponseEntity<>(uploaded, HttpStatus.CREATED);
    }

    @PostMapping("/documents/share")
    public ResponseEntity<DocumentDTO> shareDocument(
            @Valid @RequestBody ShareDocumentRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        DocumentDTO shared = documentService.shareDocument(request, currentUser);
        return ResponseEntity.ok(shared);
    }
}
