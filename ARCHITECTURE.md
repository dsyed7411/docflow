# DocFlow — Architecture & Technical Design Document

This document describes the system architecture, design decisions, data flow, security model, persistence strategy, tradeoffs, and scalability considerations for **DocFlow**.

---

## 🏛️ System Architecture

DocFlow is designed using a **Clean Layered Architecture** on the backend and a **Component-Based Unidirectional Data Flow Architecture** on the frontend.

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         REACT FRONTEND (SPA)                             │
│  React 18 | TypeScript | Vite | Tailwind CSS | TipTap Editor | Mammoth   │
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │ HTTP REST / JSON + JWT
                                     ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                      SPRING BOOT 3 BACKEND (API)                         │
│                                                                          │
│   ┌──────────────────────────────────────────────────────────────────┐   │
│   │                        CONTROLLER LAYER                          │   │
│   │     AuthController | DocumentController | ProfileController      │   │
│   └────────────────────────────────┬─────────────────────────────────┘   │
│                                    │ DTOs (Request / Response)           │
│                                    ▼                                     │
│   ┌──────────────────────────────────────────────────────────────────┐   │
│   │                          SERVICE LAYER                           │   │
│   │      AuthService  |  DocumentService  |  ProfileService          │   │
│   └────────────────────────────────┬─────────────────────────────────┘   │
│                                    │ Entities & Repositories             │
│                                    ▼                                     │
│   ┌──────────────────────────────────────────────────────────────────┐   │
│   │                        REPOSITORY LAYER                          │   │
│   │  UserRepository | DocumentRepository | DocumentShareRepository   │   │
│   └────────────────────────────────┬─────────────────────────────────┘   │
└────────────────────────────────────┼─────────────────────────────────────┘
                                     │ JDBC / Hibernate ORM
                                     ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                      DATABASE PERSISTENCE LAYER                          │
│        PostgreSQL / Supabase Postgres  (H2 Database Fallback)           │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Why Layered Architecture?

1. **Separation of Concerns**: Each layer has a distinct responsibility:
   - **Controllers**: Handle HTTP protocol concerns, input validation (`@Valid`), and HTTP response codes (`200 OK`, `201 Created`, `400 Bad Request`, `403 Forbidden`, `404 Not Found`). Controllers contain **zero business logic**.
   - **Services**: Enforce domain logic, business validations, transactional boundaries (`@Transactional`), access permissions, and mapping between Entities and DTOs.
   - **Repositories**: Encapsulate data access logic via Spring Data JPA interfaces without leaking SQL queries into services.
   - **DTOs & Mappers**: Expose safe schemas to API clients while concealing database structures and sensitive fields (e.g. password hashes).
2. **Dependency Inversion & Strict Constructor Injection**: All Spring services and controllers rely strictly on constructor injection (no `@Autowired` field injection). This ensures immutability, facilitates clean unit testing via Mockito, and guarantees explicit dependencies.

---

## 🔒 Authentication & Security Model

DocFlow implements **Stateless JWT Authentication**:

1. **Password Hashing**: Passwords are encrypted using **BCrypt** with salt before persistence.
2. **Token Generation**: On successful authentication (`/api/auth/login` or `/api/auth/register`), the backend generates an HMAC-SHA256 signed JWT containing `userId`, `email`, `name`, issued timestamp, and 24-hour expiration.
3. **Request Authorization Filter**: The `JwtAuthenticationFilter` intercepts every incoming HTTP request, extracts the `Authorization: Bearer <token>` header, verifies token signature and expiration, and populates Spring's `SecurityContextHolder` with `UserPrincipal`.
4. **Access Control & Authorization Rules**:
   - **Public Routes**: `/api/auth/**`, `/h2-console/**`, `/error`.
   - **Protected Routes**: All `/api/documents/**`, `/api/shared`, `/api/profile` endpoints require valid JWT authentication.
   - **Document Deletion**: Restricted strictly to the document **owner**. Attempts by shared users result in HTTP `403 Forbidden` (`UnauthorizedException`).
   - **Document Editing & Viewing**: Permitted for document owner or users listed in `document_shares`.

---

## 💾 Persistence & Database Model

### Entity Relational Diagram (ERD)

```
┌─────────────────────────┐               ┌─────────────────────────────────┐
│          users          │               │            documents            │
├─────────────────────────┤               ├─────────────────────────────────┤
│ id (PK, BIGINT)         │1             *│ id (PK, BIGINT)                 │
│ name (VARCHAR)          │───────────────│ title (VARCHAR)                 │
│ email (VARCHAR, UNIQUE) │               │ content (TEXT / TipTap JSON)    │
│ password (VARCHAR)      │               │ owner_id (FK -> users.id)       │
│ role (VARCHAR)          │               │ created_at (TIMESTAMP)          │
│ created_at (TIMESTAMP)  │               │ updated_at (TIMESTAMP)          │
└─────────────────────────┘               └─────────────────────────────────┘
             │ 1                                           │ 1
             │                                             │
             │ *                                           │ *
┌────────────┴─────────────────────────────────────────────┴────────────────┐
│                             document_shares                               │
├───────────────────────────────────────────────────────────────────────────┤
│ id (PK, BIGINT)                                                           │
│ document_id (FK -> documents.id)                                          │
│ user_id (FK -> users.id)                                                  │
│ UNIQUE (document_id, user_id)                                             │
└───────────────────────────────────────────────────────────────────────────┘
```

### Database Engines & Environment Flexibility
- **Production**: PostgreSQL hosted on Supabase (configured via environment variables `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`).
- **Local Dev / Testing**: Embedded H2 database auto-fallback when external DB configuration is omitted.

---

## ⚖️ Tradeoffs & Technical Decisions

| Decision | Chosen Solution | Tradeoff / Rationale |
| :--- | :--- | :--- |
| **Document Storage** | TipTap JSON in `TEXT` column | Storing document state as JSON preserves rich formatting, headings, and mark structures reliably while remaining database-agnostic. |
| **Autosave Implementation** | Debounced 2s frontend autosave | Avoids spamming backend servers with HTTP requests on every keystroke while ensuring changes are safely persisted every 2 seconds of inactivity. |
| **File Imports** | Client-side parsing via Mammoth.js | Offloads `.docx` parsing load from the Spring Boot backend server directly to the browser runtime, speeding up import performance. |
| **State Management** | React Context (`AuthContext`) | Avoids unnecessary Redux overhead for lightweight SaaS application while providing clean session state management across routes. |

---

## 📈 Scalability Considerations

1. **Stateless API Backend**: Because Spring Security uses stateless JWT tokens without HTTP server sessions, backend instances can be horizontally scaled behind a load balancer without sticky session requirements.
2. **Database Indexing**: Foreign key constraints on `owner_id`, `document_id`, `user_id`, and unique index on `email` ensure constant-time `O(1)` query lookups for authentication and document retrieval.
3. **Caching & CDN**: Static frontend assets compiled via Vite can be distributed globally across edge networks (e.g. Vercel CDN), reducing latency.
