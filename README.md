# DocFlow — Collaborative Document Workspace

> **Tagline**: Collaborative document workspace.

DocFlow is a production-quality, lightweight SaaS productivity application inspired by Google Docs, Notion, and Dropbox Paper. Designed with a clean, minimal design aesthetic, responsive UI, secure JWT authentication, rich text editing with automatic background saving, file imports (.txt, .md, .docx), and document sharing.

---

## 🚀 Tech Stack

### Frontend
- **React 18** & **TypeScript**
- **Vite** (Next-gen frontend tooling)
- **Tailwind CSS** (Custom palette, soft shadows, responsive design)
- **React Router v6** (Protected route management)
- **TipTap Editor** (Rich text editor framework with JSON persistence)
- **Mammoth.js** (.docx client-side parser)
- **Axios** (API requests with JWT interceptors)
- **React Hot Toast** (Toast notifications)
- **Lucide React** (Modern SVG icon set)

### Backend
- **Java 21**
- **Spring Boot 3**
- **Spring Security** & **JWT Authentication**
- **Spring Data JPA** & **Hibernate**
- **Maven** (Dependency & build management)
- **JUnit 5 & Mockito** (Service layer unit testing)

### Database & Persistence
- **PostgreSQL / Supabase Postgres** (Production DB)
- **H2 Database** (Automatic local development fallback)

### Deployment Targets
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: Supabase PostgreSQL

---

## ✨ Features

- 🔐 **JWT Authentication**: User registration, login, logout, and persistent sessions across browser reloads.
- 👥 **Seeded Demo Accounts**: Auto-generated `Alice` and `Bob` demo accounts created at application startup for immediate reviewer testing.
- 📝 **Rich Text Editor**: TipTap editor supporting Bold, Italic, Underline, Headings (H1, H2), Bullet Lists, Numbered Lists, Horizontal Rules, Undo, and Redo.
- 💾 **Smart Autosave**: Automatically saves changes after 2 seconds of inactivity with visual indicators (`Saving...`, `Saved`, `Save Failed`), plus manual save trigger.
- 📁 **File Import & Parsing**: Import `.txt`, `.md`, and `.docx` (via Mammoth parser) into new editable documents with file type validation.
- 🤝 **Document Sharing**: Share documents with registered users by email with full view and edit privileges.
- 🔍 **Instant Search**: Search documents by title in real-time across dashboard views.
- 📊 **Dashboard & Profile**: View recent, owned, and shared documents alongside account stats.
- 📱 **Responsive Design**: Collapsible sidebar, mobile navigation drawer, and crisp typography.

---

## 🔑 Demo Accounts

The application automatically seeds two reviewer accounts at startup if they do not exist:

| Account | Email | Password |
| :--- | :--- | :--- |
| **User 1 (Alice)** | `alice@example.com` | `Password123` |
| **User 2 (Bob)** | `bob@example.com` | `Password123` |

---

## 📁 Repository Structure

```
c:\Users\DELL\Desktop\ajaia assignment\
├── backend/
│   ├── src/main/java/com/docflow/
│   │   ├── config/          # Security, CORS, and DataInitializer (seed data)
│   │   ├── controller/      # REST API Controllers (Auth, Document, Profile)
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── entity/          # JPA Entities (User, Document, DocumentShare)
│   │   ├── exception/       # Global Exception Handler & Custom Exceptions
│   │   ├── mapper/          # DTO Mappers
│   │   ├── repository/      # Spring Data JPA Repositories
│   │   ├── security/        # JWT Filter, Token Provider, UserDetails
│   │   ├── service/         # Business Logic (Constructor Injection only)
│   │   └── DocFlowApplication.java
│   ├── src/main/resources/  # application.yml
│   ├── src/test/java/       # Service Unit Tests (JUnit 5 & Mockito)
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, Sidebar, Editor, Modals, Cards
│   │   ├── contexts/        # AuthContext (JWT session state)
│   │   ├── hooks/           # useAutosave, useAuth
│   │   ├── pages/           # Login, Register, Dashboard, SharedWithMe, Editor, Profile
│   │   ├── services/        # Axios API Client & Services
│   │   ├── types/           # TypeScript Type Definitions
│   │   ├── utils/           # Mammoth file parser & date formatters
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── README.md
├── ARCHITECTURE.md
├── AI_WORKFLOW.md
└── SUBMISSION.md
```

---

## 🛠️ Local Setup & Running

### Prerequisites
- **Java 21 JDK** or newer
- **Maven 3.9+** (or included Maven wrapper)
- **Node.js 18+** & **pnpm / npm**

### 1. Running the Backend

```bash
cd backend

# Environment variables (Optional for Supabase Postgres, defaults to H2 in-memory DB)
# export SPRING_DATASOURCE_URL=jdbc:postgresql://<supabase-host>:5432/postgres
# export SPRING_DATASOURCE_USERNAME=postgres
# export SPRING_DATASOURCE_PASSWORD=your-supabase-password

# Run unit tests
mvn test

# Start backend server
mvn spring-boot:run
```
*Backend runs at `http://localhost:8080`.*

### 2. Running the Frontend

```bash
cd frontend

# Install dependencies
pnpm install

# Build production bundle / test types
pnpm build

# Start Vite development server
pnpm dev
```
*Frontend runs at `http://localhost:5173`.*

---

## 🚀 Deployment Instructions

### Frontend Deployment (Vercel)
1. Push codebase to GitHub repository.
2. Import project into Vercel dashboard and choose `frontend` as Root Directory.
3. Build command: `pnpm build` (or `npm run build`), Output directory: `dist`.
4. Add Environment Variable: `VITE_API_URL=https://<your-render-backend-url>.onrender.com/api`.

### Backend Deployment (Render)
1. Create new Web Service on Render pointing to `backend/`.
2. Build command: `mvn clean package -DskipTests`.
3. Start command: `java -jar target/docflow-backend-1.0.0.jar`.
4. Configure Environment Variables:
   - `SPRING_DATASOURCE_URL`: `jdbc:postgresql://<supabase-db-host>:5432/postgres`
   - `SPRING_DATASOURCE_USERNAME`: `<supabase-db-user>`
   - `SPRING_DATASOURCE_PASSWORD`: `<supabase-db-password>`
   - `SPRING_DATASOURCE_DRIVER_CLASS_NAME`: `org.postgresql.Driver`
   - `JWT_SECRET`: `<your-random-64-character-secret>`
   - `CORS_ALLOWED_ORIGINS`: `https://<your-vercel-app>.vercel.app`

---

## 🔮 Future Improvements

- Real-time collaborative editing using WebSockets / Yjs / CRDTs.
- Document version history & restore points.
- Granular permissions (View-only vs Edit access).
- Commenting threads & inline suggestions.
