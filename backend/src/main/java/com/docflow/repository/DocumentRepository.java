package com.docflow.repository;

import com.docflow.entity.Document;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {

    @Override
    @EntityGraph(attributePaths = {"owner"})
    Optional<Document> findById(Long id);

    @EntityGraph(attributePaths = {"owner"})
    List<Document> findByOwnerIdOrderByUpdatedAtDesc(Long ownerId);

    @Query("SELECT DISTINCT d FROM Document d JOIN FETCH d.owner LEFT JOIN DocumentShare ds ON d.id = ds.document.id WHERE ds.user.id = :userId ORDER BY d.updatedAt DESC")
    List<Document> findSharedWithUser(@Param("userId") Long userId);

    @Query("SELECT DISTINCT d FROM Document d JOIN FETCH d.owner LEFT JOIN DocumentShare ds ON d.id = ds.document.id WHERE d.owner.id = :userId OR ds.user.id = :userId ORDER BY d.updatedAt DESC")
    List<Document> findAllAccessibleByUser(@Param("userId") Long userId);

    @Query("SELECT DISTINCT d FROM Document d JOIN FETCH d.owner LEFT JOIN DocumentShare ds ON d.id = ds.document.id WHERE (d.owner.id = :userId OR ds.user.id = :userId) AND LOWER(d.title) LIKE LOWER(CONCAT('%', :title, '%')) ORDER BY d.updatedAt DESC")
    List<Document> searchAccessibleByUserAndTitle(@Param("userId") Long userId, @Param("title") String title);
}
