package com.docflow.repository;

import com.docflow.entity.DocumentShare;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentShareRepository extends JpaRepository<DocumentShare, Long> {

    List<DocumentShare> findByDocumentId(Long documentId);

    Optional<DocumentShare> findByDocumentIdAndUserId(Long documentId, Long userId);

    boolean existsByDocumentIdAndUserId(Long documentId, Long userId);

    void deleteByDocumentId(Long documentId);
}
