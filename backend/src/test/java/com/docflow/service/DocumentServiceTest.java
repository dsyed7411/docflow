package com.docflow.service;

import com.docflow.dto.CreateDocumentRequest;
import com.docflow.dto.DocumentDTO;
import com.docflow.dto.ShareDocumentRequest;
import com.docflow.entity.Document;
import com.docflow.entity.User;
import com.docflow.exception.UnauthorizedException;
import com.docflow.mapper.DocumentMapper;
import com.docflow.mapper.UserMapper;
import com.docflow.repository.DocumentRepository;
import com.docflow.repository.DocumentShareRepository;
import com.docflow.repository.UserRepository;
import com.docflow.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DocumentServiceTest {

    @Mock
    private DocumentRepository documentRepository;

    @Mock
    private DocumentShareRepository documentShareRepository;

    @Mock
    private UserRepository userRepository;

    private DocumentService documentService;

    private User ownerUser;
    private User otherUser;
    private UserPrincipal ownerPrincipal;
    private UserPrincipal otherPrincipal;
    private Document sampleDocument;

    @BeforeEach
    void setUp() {
        UserMapper userMapper = new UserMapper();
        DocumentMapper documentMapper = new DocumentMapper(userMapper);

        documentService = new DocumentService(
                documentRepository,
                documentShareRepository,
                userRepository,
                documentMapper
        );

        ownerUser = User.builder()
                .id(1L)
                .name("Alice")
                .email("alice@example.com")
                .password("encoded_pass")
                .role("ROLE_USER")
                .createdAt(LocalDateTime.now())
                .build();

        otherUser = User.builder()
                .id(2L)
                .name("Bob")
                .email("bob@example.com")
                .password("encoded_pass")
                .role("ROLE_USER")
                .createdAt(LocalDateTime.now())
                .build();

        ownerPrincipal = UserPrincipal.create(ownerUser);
        otherPrincipal = UserPrincipal.create(otherUser);

        sampleDocument = Document.builder()
                .id(100L)
                .title("Sample Doc")
                .content("{\"type\":\"doc\",\"content\":[]}")
                .owner(ownerUser)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("Should create document successfully for authenticated user")
    void createDocument_Success() {
        CreateDocumentRequest request = new CreateDocumentRequest("Test Title", "Content");

        when(userRepository.findById(1L)).thenReturn(Optional.of(ownerUser));
        when(documentRepository.save(any(Document.class))).thenAnswer(invocation -> {
            Document doc = invocation.getArgument(0);
            doc.setId(101L);
            return doc;
        });

        DocumentDTO result = documentService.createDocument(request, ownerPrincipal);

        assertNotNull(result);
        assertEquals(101L, result.getId());
        assertEquals("Test Title", result.getTitle());
        assertTrue(result.isOwner());
        verify(documentRepository, times(1)).save(any(Document.class));
    }

    @Test
    @DisplayName("Should throw UnauthorizedException when non-owner attempts to delete document")
    void deleteDocument_NonOwner_ThrowsUnauthorized() {
        when(documentRepository.findById(100L)).thenReturn(Optional.of(sampleDocument));

        assertThrows(UnauthorizedException.class, () -> {
            documentService.deleteDocument(100L, otherPrincipal);
        });

        verify(documentRepository, never()).delete(any(Document.class));
    }

    @Test
    @DisplayName("Should delete document when owner calls delete")
    void deleteDocument_Owner_Success() {
        when(documentRepository.findById(100L)).thenReturn(Optional.of(sampleDocument));

        documentService.deleteDocument(100L, ownerPrincipal);

        verify(documentShareRepository, times(1)).deleteByDocumentId(100L);
        verify(documentRepository, times(1)).delete(sampleDocument);
    }

    @Test
    @DisplayName("Should share document successfully when called by owner")
    void shareDocument_Success() {
        ShareDocumentRequest request = new ShareDocumentRequest(100L, "bob@example.com");

        when(documentRepository.findById(100L)).thenReturn(Optional.of(sampleDocument));
        when(userRepository.findByEmail("bob@example.com")).thenReturn(Optional.of(otherUser));
        when(userRepository.findById(1L)).thenReturn(Optional.of(ownerUser));
        when(documentShareRepository.existsByDocumentIdAndUserId(100L, 2L)).thenReturn(false);
        when(documentShareRepository.findByDocumentId(100L)).thenReturn(Collections.emptyList());

        DocumentDTO result = documentService.shareDocument(request, ownerPrincipal);

        assertNotNull(result);
        verify(documentShareRepository, times(1)).save(any());
    }
}
