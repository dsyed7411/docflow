package com.docflow.service;

import com.docflow.dto.ProfileDTO;
import com.docflow.entity.User;
import com.docflow.exception.ResourceNotFoundException;
import com.docflow.repository.DocumentRepository;
import com.docflow.repository.UserRepository;
import com.docflow.security.UserPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfileService {

    private final UserRepository userRepository;
    private final DocumentRepository documentRepository;

    public ProfileService(UserRepository userRepository, DocumentRepository documentRepository) {
        this.userRepository = userRepository;
        this.documentRepository = documentRepository;
    }

    @Transactional(readOnly = true)
    public ProfileDTO getProfile(UserPrincipal currentUser) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        int ownedCount = documentRepository.findByOwnerIdOrderByUpdatedAtDesc(user.getId()).size();
        int sharedCount = documentRepository.findSharedWithUser(user.getId()).size();

        return ProfileDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .ownedDocumentsCount(ownedCount)
                .sharedDocumentsCount(sharedCount)
                .createdAt(user.getCreatedAt())
                .build();
    }
}
