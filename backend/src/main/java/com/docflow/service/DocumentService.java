package com.docflow.service;

import com.docflow.dto.*;
import com.docflow.entity.Document;
import com.docflow.entity.DocumentShare;
import com.docflow.entity.User;
import com.docflow.exception.BadRequestException;
import com.docflow.exception.ResourceNotFoundException;
import com.docflow.exception.UnauthorizedException;
import com.docflow.mapper.DocumentMapper;
import com.docflow.repository.DocumentRepository;
import com.docflow.repository.DocumentShareRepository;
import com.docflow.repository.UserRepository;
import com.docflow.security.UserPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final DocumentShareRepository documentShareRepository;
    private final UserRepository userRepository;
    private final DocumentMapper documentMapper;

    public DocumentService(DocumentRepository documentRepository,
                           DocumentShareRepository documentShareRepository,
                           UserRepository userRepository,
                           DocumentMapper documentMapper) {
        this.documentRepository = documentRepository;
        this.documentShareRepository = documentShareRepository;
        this.userRepository = userRepository;
        this.documentMapper = documentMapper;
    }

    @Transactional(readOnly = true)
    public List<DocumentDTO> getOwnedDocuments(UserPrincipal currentUser) {
        User user = getUserEntity(currentUser.getId());
        List<Document> documents = documentRepository.findByOwnerIdOrderByUpdatedAtDesc(user.getId());
        return documents.stream()
                .map(doc -> documentMapper.toDTO(doc, user, getSharedUsers(doc.getId())))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<DocumentDTO> getSharedDocuments(UserPrincipal currentUser) {
        User user = getUserEntity(currentUser.getId());
        List<Document> documents = documentRepository.findSharedWithUser(user.getId());
        return documents.stream()
                .map(doc -> documentMapper.toDTO(doc, user, getSharedUsers(doc.getId())))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<DocumentDTO> searchDocuments(UserPrincipal currentUser, String search) {
        User user = getUserEntity(currentUser.getId());
        List<Document> documents;
        if (search != null && !search.trim().isEmpty()) {
            documents = documentRepository.searchAccessibleByUserAndTitle(user.getId(), search.trim());
        } else {
            documents = documentRepository.findAllAccessibleByUser(user.getId());
        }
        return documents.stream()
                .map(doc -> documentMapper.toDTO(doc, user, getSharedUsers(doc.getId())))
                .toList();
    }

    @Transactional(readOnly = true)
    public DocumentDTO getDocumentById(Long id, UserPrincipal currentUser) {
        User user = getUserEntity(currentUser.getId());
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + id));

        verifyAccessPermission(document, user.getId());

        return documentMapper.toDTO(document, user, getSharedUsers(document.getId()));
    }

    @Transactional
    public DocumentDTO createDocument(CreateDocumentRequest request, UserPrincipal currentUser) {
        User owner = getUserEntity(currentUser.getId());

        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            throw new BadRequestException("Document title cannot be empty");
        }

        Document document = Document.builder()
                .title(request.getTitle().trim())
                .content(request.getContent() != null ? request.getContent() : "{\"type\":\"doc\",\"content\":[{\"type\":\"paragraph\",\"content\":[]}]}")
                .owner(owner)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Document savedDoc = documentRepository.save(document);
        return documentMapper.toDTO(savedDoc, owner, List.of());
    }

    @Transactional
    public DocumentDTO updateDocument(Long id, UpdateDocumentRequest request, UserPrincipal currentUser) {
        User user = getUserEntity(currentUser.getId());
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + id));

        verifyAccessPermission(document, user.getId());

        if (request.getTitle() != null && !request.getTitle().trim().isEmpty()) {
            document.setTitle(request.getTitle().trim());
        }
        if (request.getContent() != null) {
            document.setContent(request.getContent());
        }
        document.setUpdatedAt(LocalDateTime.now());

        Document updatedDoc = documentRepository.save(document);
        return documentMapper.toDTO(updatedDoc, user, getSharedUsers(updatedDoc.getId()));
    }

    @Transactional
    public void deleteDocument(Long id, UserPrincipal currentUser) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + id));

        // SECURITY REQUIREMENT: Only owner may delete
        if (!document.getOwner().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("Only the document owner can delete this document");
        }

        documentShareRepository.deleteByDocumentId(id);
        documentRepository.delete(document);
    }

    @Transactional
    public DocumentDTO uploadDocument(UploadDocumentRequest request, UserPrincipal currentUser) {
        User owner = getUserEntity(currentUser.getId());

        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            throw new BadRequestException("Upload title is required");
        }

        Document document = Document.builder()
                .title(request.getTitle().trim())
                .content(request.getContent() != null ? request.getContent() : "")
                .owner(owner)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Document savedDoc = documentRepository.save(document);
        return documentMapper.toDTO(savedDoc, owner, List.of());
    }

    @Transactional
    public DocumentDTO shareDocument(ShareDocumentRequest request, UserPrincipal currentUser) {
        Document document = documentRepository.findById(request.getDocumentId())
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + request.getDocumentId()));

        // Security: Only owner may share
        if (!document.getOwner().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("Only the document owner can share this document");
        }

        String targetEmail = request.getEmail().trim().toLowerCase();
        User targetUser = userRepository.findByEmail(targetEmail)
                .orElseThrow(() -> new BadRequestException("No registered user found with email: " + targetEmail));

        if (targetUser.getId().equals(currentUser.getId())) {
            throw new BadRequestException("You cannot share a document with yourself");
        }

        if (!documentShareRepository.existsByDocumentIdAndUserId(document.getId(), targetUser.getId())) {
            DocumentShare share = DocumentShare.builder()
                    .document(document)
                    .user(targetUser)
                    .build();
            documentShareRepository.save(share);
        }

        User owner = getUserEntity(currentUser.getId());
        return documentMapper.toDTO(document, owner, getSharedUsers(document.getId()));
    }

    private void verifyAccessPermission(Document document, Long userId) {
        boolean isOwner = document.getOwner().getId().equals(userId);
        boolean isShared = documentShareRepository.existsByDocumentIdAndUserId(document.getId(), userId);

        if (!isOwner && !isShared) {
            throw new UnauthorizedException("You do not have permission to access this document");
        }
    }

    private User getUserEntity(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private List<User> getSharedUsers(Long documentId) {
        return documentShareRepository.findByDocumentId(documentId).stream()
                .map(DocumentShare::getUser)
                .toList();
    }
}
