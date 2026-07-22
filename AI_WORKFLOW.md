# AI Workflow & Engineering Process Document

This document outlines the collaborative AI-assisted workflow utilized to design, architect, implement, test, and document **DocFlow**.

---

## 🤖 AI Tools & Environment

- **Primary AI Agent**: Google Antigravity (Powered by Gemini 3.6 Flash).
- **Capabilities Leveraged**:
  - Full-stack codebase architecture planning.
  - Automated project scaffolding (Spring Boot 3 + React 18 + Vite).
  - Terminal-driven runtime diagnostics and test verification.
  - Interactive design system crafting with Tailwind CSS.

---

## ⚡ Accelerated Development Areas

1. **Clean Layered Backend Scaffolding**:
   - Rapidly created Java 21 Spring Boot 3 controllers, services, repositories, DTOs, entities, and mappers following strict constructor injection guidelines.
   - Built stateless JWT security pipeline (`JwtTokenProvider`, `JwtAuthenticationFilter`, `CustomUserDetailsService`, `SecurityConfig`).

2. **TipTap Rich Text Integration & Autosave**:
   - Integrated TipTap editor extensions (Bold, Italic, Underline, Headings, Lists, HR, Undo/Redo) with JSON document state persistence.
   - Created a custom React hook `useAutosave` featuring a 2-second debounced save timer and reactive status feedback (`Saving...`, `Saved`, `Save Failed`).

3. **Client-Side File Import Pipeline**:
   - Implemented Mammoth.js `.docx` file conversion alongside plain `.txt` and `.md` file reader routines.

4. **Demo Account Auto-Seeding**:
   - Built `DataInitializer` to auto-seed reviewer accounts `Alice` (`alice@example.com` / `Password123`) and `Bob` (`bob@example.com` / `Password123`) upon backend startup.

---

## 🔍 Code Review, Refactorings & Manual Adaptations

During automated build verification, several critical code review adjustments were executed:

1. **Explicit Java Getters, Setters & Builders**:
   - Replaced Lombok annotation processing dependencies with explicit Java methods across entities and DTOs to ensure 100% compiler compatibility across all JDK/Maven build environments.
2. **JJWT 0.12.x Modern API Migration**:
   - Refactored JWT token signing and parsing methods to match modern JJWT 0.12.x immutable builder syntax (`Keys.hmacShaKeyFor`, `Jwts.parser().verifyWith(...).build()`).
3. **Mammoth Module Declaration**:
   - Added custom `mammoth.d.ts` module declaration file to resolve missing npm type definitions during TypeScript build verification.

---

## 🧪 Verification & Quality Strategy

Correctness was empirically verified through automated test suites and production build validations:

- **Backend Unit Testing**: Executed `mvn test` running JUnit 5 and Mockito tests (`DocumentServiceTest`). All 4 test cases passed with 0 failures and 0 errors.
- **Frontend Type Safety**: Ran `tsc --noEmit` to verify zero TypeScript errors.
- **Production Asset Compilation**: Ran `vite build` to compile minified HTML, CSS, and JS bundles inside `frontend/dist/`.
