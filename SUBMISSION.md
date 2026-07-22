# Submission Deliverables — DocFlow

This submission package contains a full-stack, production-quality collaborative document workspace application built to professional software engineering standards.

---

## 📦 Delivered Artifacts & File Sitemap

### 1. Root Documentation
- [x] [`README.md`](file:///c:/Users/DELL/Desktop/ajaia%20assignment/README.md) — Comprehensive project overview, tech stack, setup guide, environment variables, deployment instructions, and reviewer demo accounts.
- [x] [`ARCHITECTURE.md`](file:///c:/Users/DELL/Desktop/ajaia%20assignment/ARCHITECTURE.md) — Deep-dive architectural documentation detailing layered design, security filter pipelines, ERD data models, tradeoffs, and scalability strategy.
- [x] [`AI_WORKFLOW.md`](file:///c:/Users/DELL/Desktop/ajaia%20assignment/AI_WORKFLOW.md) — Explanation of AI-assisted development tools, manual code review refactorings, and verification process.
- [x] [`SUBMISSION.md`](file:///c:/Users/DELL/Desktop/ajaia%20assignment/SUBMISSION.md) — Master checklist of deliverables.

---

### 2. Backend Application (`backend/`)
- [x] [`pom.xml`](file:///c:/Users/DELL/Desktop/ajaia%20assignment/backend/pom.xml) — Maven build configuration with Spring Boot 3.2, Java 21, Spring Security, Data JPA, JJWT 0.12.5, PostgreSQL, H2, and JUnit 5/Mockito.
- [x] [`application.yml`](file:///c:/Users/DELL/Desktop/ajaia%20assignment/backend/src/main/resources/application.yml) — Production PostgreSQL/Supabase DB properties with auto-fallback to embedded H2.
- [x] [`DocFlowApplication.java`](file:///c:/Users/DELL/Desktop/ajaia%20assignment/backend/src/main/java/com/docflow/DocFlowApplication.java) — Spring Boot entry point.
- [x] **Entities**:
  - [`User.java`](file:///c:/Users/DELL/Desktop/ajaia%20assignment/backend/src/main/java/com/docflow/entity/User.java)
  - [`Document.java`](file:///c:/Users/DELL/Desktop/ajaia%20assignment/backend/src/main/java/com/docflow/entity/Document.java)
  - [`DocumentShare.java`](file:///c:/Users/DELL/Desktop/ajaia%20assignment/backend/src/main/java/com/docflow/entity/DocumentShare.java)
- [x] **Repositories**:
  - [`UserRepository.java`](file:///c:/Users/DELL/Desktop/ajaia%20assignment/backend/src/main/java/com/docflow/repository/UserRepository.java)
  - [`DocumentRepository.java`](file:///c:/Users/DELL/Desktop/ajaia%20assignment/backend/src/main/java/com/docflow/repository/DocumentRepository.java)
  - [`DocumentShareRepository.java`](file:///c:/Users/DELL/Desktop/ajaia%20assignment/backend/src/main/java/com/docflow/repository/DocumentShareRepository.java)
- [x] **Services**:
  - [`AuthService.java`](file:///c:/Users/DELL/Desktop/ajaia%20assignment/backend/src/main/java/com/docflow/service/AuthService.java)
  - [`DocumentService.java`](file:///c:/Users/DELL/Desktop/ajaia%20assignment/backend/src/main/java/com/docflow/service/DocumentService.java)
  - [`ProfileService.java`](file:///c:/Users/DELL/Desktop/ajaia%20assignment/backend/src/main/java/com/docflow/service/ProfileService.java)
- [x] **Controllers**:
  - [`AuthController.java`](file:///c:/Users/DELL/Desktop/ajaia%20assignment/backend/src/main/java/com/docflow/controller/AuthController.java)
  - [`DocumentController.java`](file:///c:/Users/DELL/Desktop/ajaia%20assignment/backend/src/main/java/com/docflow/controller/DocumentController.java)
  - [`ProfileController.java`](file:///c:/Users/DELL/Desktop/ajaia%20assignment/backend/src/main/java/com/docflow/controller/ProfileController.java)
- [x] **Security**:
  - [`SecurityConfig.java`](file:///c:/Users/DELL/Desktop/ajaia%20assignment/backend/src/main/java/com/docflow/config/SecurityConfig.java)
  - [`JwtAuthenticationFilter.java`](file:///c:/Users/DELL/Desktop/ajaia%20assignment/backend/src/main/java/com/docflow/security/JwtAuthenticationFilter.java)
  - [`JwtTokenProvider.java`](file:///c:/Users/DELL/Desktop/ajaia%20assignment/backend/src/main/java/com/docflow/security/JwtTokenProvider.java)
  - [`UserPrincipal.java`](file:///c:/Users/DELL/Desktop/ajaia%20assignment/backend/src/main/java/com/docflow/security/UserPrincipal.java)
- [x] **Seed Data**:
  - [`DataInitializer.java`](file:///c:/Users/DELL/Desktop/ajaia%20assignment/backend/src/main/java/com/docflow/config/DataInitializer.java) (Auto-seeds demo users Alice & Bob)
- [x] **Exception Handling**:
  - [`GlobalExceptionHandler.java`](file:///c:/Users/DELL/Desktop/ajaia%20assignment/backend/src/main/java/com/docflow/exception/GlobalExceptionHandler.java) (Structured `{ timestamp, status, message, path }` JSON responses)
- [x] **Unit Testing**:
  - [`DocumentServiceTest.java`](file:///c:/Users/DELL/Desktop/ajaia%20assignment/backend/src/test/java/com/docflow/service/DocumentServiceTest.java) (JUnit 5 + Mockito service tests)

---

### 3. Frontend Application (`frontend/`)
- [x] [`package.json`](file:///c:/Users/DELL/Desktop/ajaia%20assignment/frontend/package.json) — React 18, TypeScript, Vite, Tailwind CSS, TipTap, Mammoth, Axios, Lucide React, React Hot Toast.
- [x] **Components**:
  - [`Navbar.tsx`](file:///c:/Users/DELL/Desktop/ajaia%20assignment/frontend/src/components/Navbar.tsx)
  - [`Sidebar.tsx`](file:///c:/Users/DELL/Desktop/ajaia%20assignment/frontend/src/components/Sidebar.tsx)
  - [`DocumentCard.tsx`](file:///c:/Users/DELL/Desktop/ajaia%20assignment/frontend/src/components/DocumentCard.tsx)
  - [`RichTextEditor.tsx`](file:///c:/Users/DELL/Desktop/ajaia%20assignment/frontend/src/components/RichTextEditor.tsx)
  - [`Toolbar.tsx`](file:///c:/Users/DELL/Desktop/ajaia%20assignment/frontend/src/components/Toolbar.tsx)
  - [`ShareModal.tsx`](file:///c:/Users/DELL/Desktop/ajaia%20assignment/frontend/src/components/ShareModal.tsx)
  - [`UploadModal.tsx`](file:///c:/Users/DELL/Desktop/ajaia%20assignment/frontend/src/components/UploadModal.tsx)
  - [`SearchBar.tsx`](file:///c:/Users/DELL/Desktop/ajaia%20assignment/frontend/src/components/SearchBar.tsx)
- [x] **Pages**:
  - [`Login.tsx`](file:///c:/Users/DELL/Desktop/ajaia%20assignment/frontend/src/pages/Login.tsx) (With 1-click reviewer shortcuts for Alice and Bob)
  - [`Register.tsx`](file:///c:/Users/DELL/Desktop/ajaia%20assignment/frontend/src/pages/Register.tsx)
  - [`Dashboard.tsx`](file:///c:/Users/DELL/Desktop/ajaia%20assignment/frontend/src/pages/Dashboard.tsx)
  - [`SharedWithMe.tsx`](file:///c:/Users/DELL/Desktop/ajaia%20assignment/frontend/src/pages/SharedWithMe.tsx)
  - [`DocumentEditor.tsx`](file:///c:/Users/DELL/Desktop/ajaia%20assignment/frontend/src/pages/DocumentEditor.tsx)
  - [`Profile.tsx`](file:///c:/Users/DELL/Desktop/ajaia%20assignment/frontend/src/pages/Profile.tsx)
- [x] **Hooks & Services**:
  - [`useAutosave.ts`](file:///c:/Users/DELL/Desktop/ajaia%20assignment/frontend/src/hooks/useAutosave.ts) (2s inactivity debounce)
  - [`AuthContext.tsx`](file:///c:/Users/DELL/Desktop/ajaia%20assignment/frontend/src/contexts/AuthContext.tsx)
  - [`api.ts`](file:///c:/Users/DELL/Desktop/ajaia%20assignment/frontend/src/services/api.ts)
  - [`fileParsers.ts`](file:///c:/Users/DELL/Desktop/ajaia%20assignment/frontend/src/utils/fileParsers.ts) (Mammoth DOCX & text parsing)

---

## 🎯 Verification Credentials

To immediately evaluate the application:

1. **User 1 (Alice)**:
   - Email: `alice@example.com`
   - Password: `Password123`
2. **User 2 (Bob)**:
   - Email: `bob@example.com`
   - Password: `Password123`
