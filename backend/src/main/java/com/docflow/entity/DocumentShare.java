package com.docflow.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "document_shares", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"document_id", "user_id"})
})
public class DocumentShare {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "document_id", nullable = false)
    private Document document;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public DocumentShare() {
    }

    public DocumentShare(Long id, Document document, User user) {
        this.id = id;
        this.document = document;
        this.user = user;
    }

    public static DocumentShareBuilder builder() {
        return new DocumentShareBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Document getDocument() { return document; }
    public void setDocument(Document document) { this.document = document; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public static class DocumentShareBuilder {
        private Long id;
        private Document document;
        private User user;

        DocumentShareBuilder() {}

        public DocumentShareBuilder id(Long id) { this.id = id; return this; }
        public DocumentShareBuilder document(Document document) { this.document = document; return this; }
        public DocumentShareBuilder user(User user) { this.user = user; return this; }

        public DocumentShare build() {
            return new DocumentShare(id, document, user);
        }
    }
}
