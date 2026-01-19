# Mini SaaS Dashboard

A production-ready project management dashboard built as a full-stack developer assessment. This project demonstrates clean architecture, proper separation of concerns, real-time updates, toast notifications, and comprehensive testing.

**Live Demo:** [https://interview.bard-labs.com](https://interview.bard-labs.com)

> **Test Account:** `alice@example.com` / `password123`

**IMPORTANT:** When signing up, an email confirmation will be sent.

---

## Table of Contents

- [What This Project Demonstrates](#-what-this-project-demonstrates)
- [Architecture Overview](#️-architecture-overview)
  - [The Big Picture](#the-big-picture)
  - [Layer Separation Philosophy](#layer-separation-philosophy)
- [Project Structure](#️-project-structure)
- [Key Architectural Patterns](#-key-architectural-patterns)
  - [1. Provider Pattern for State Management](#1-provider-pattern-for-state-management)
  - [2. Custom Hooks for Reusable Logic](#2-custom-hooks-for-reusable-logic)
  - [3. API Layer Abstraction](#3-api-layer-abstraction)
- [Database Design](#️-database-design)
  - [Schema](#schema)
  - [Row-Level Security (RLS)](#row-level-security-rls)
  - [Realtime Subscriptions](#realtime-subscriptions)
- [Tech Stack](#️-tech-stack)
- [Features](#-features)
  - [Project Management](#project-management)
  - [Project Details Page](#project-details-page)
  - [Filtering & Search](#filtering--search)
  - [Real-time Updates](#real-time-updates)
  - [Toast Notifications](#toast-notifications)
  - [Pagination](#pagination)
- [Testing Strategy](#-testing-strategy)
  - [Unit Tests](#unit-tests)
  - [Hook Tests](#hook-tests)
  - [Storybook](#storybook)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Dev Workflow](#-dev-workflow)
- [Docker Support](#-docker-support)
  - [Production Build](#production-build)
  - [Development with Hot Reload](#development-with-hot-reload)
  - [Health Check](#health-check)
- [Running Locally](#-running-locally)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
  - [Database Setup](#database-setup)
  - [Seeding Data](#seeding-data)
  - [Start Development Server](#start-development-server)
- [Available Scripts](#-available-scripts)
- [API Reference](#-api-reference)
  - [Authentication](#authentication)
  - [Projects API](#projects-api)
  - [Users API](#users-api)
  - [Health Check](#health-check-1)
  - [Error Handling](#error-handling)
  - [Testing the API](#testing-the-api)
  - [Security Features](#security-features)
  - [Real-time Updates](#real-time-updates-1)
- [Deployment](#-deployment)
- [Requirements Checklist](#-requirements-checklist)
  - [Core Requirements](#core-requirements-)
  - [Bonus Points](#bonus-points-)
  - [Beyond Requirements](#beyond-requirements-)
- [What I Would Add Next](#-what-i-would-add-next)

---

## 🎯 What This Project Demonstrates

| Category                | Implementation                                               |
| ----------------------- | ------------------------------------------------------------ |
| **Clean Architecture**  | Clear separation between UI, business logic, and data layers |
| **Provider Pattern**    | Context-based state management without prop drilling         |
| **Custom Hooks**        | Reusable logic extracted into composable hooks               |
| **API Abstraction**     | HTTP calls isolated in a dedicated API layer                 |
| **Real-time Updates**   | Smart Supabase subscriptions with filtering awareness        |
| **Toast Notifications** | Consistent error/success feedback across the app             |
| **Security First**      | Row-level security policies at the database level            |
| **Type Safety**         | Full TypeScript with strict typing and enums                 |
| **Testing Culture**     | Unit tests, hook tests, and Storybook stories                |
| **DevOps Ready**        | CI/CD pipeline, Docker support, health checks                |

---

## 🏗️ Architecture Overview

### The Big Picture

```
┌─────────────────────────────────────────────────────────────┐
│                        UI LAYER                             │
│  components/  →  Pure presentational, receives props        │
│  app/         →  Pages, layouts, routing                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     STATE LAYER                             │
│  lib/providers/  →  Context providers, state management     │
│  lib/hooks/      →  Reusable stateful logic                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                             │
│  lib/apis/       →  HTTP calls, API abstraction             │
│  app/api/        →  Backend API routes                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER                           │
│  Supabase        →  PostgreSQL + RLS + Realtime             │
└─────────────────────────────────────────────────────────────┘
```

### Layer Separation Philosophy

**UI Layer** → Pure presentation, no business logic

- Components receive props and render UI
- No direct API calls or state management
- Easy to test in isolation with Storybook

**State Layer** → Business logic and state management

- Context providers eliminate prop drilling
- Custom hooks encapsulate reusable logic
- Clean separation of concerns

**Data Layer** → API abstraction

- Single source of truth for HTTP calls
- Consistent error handling
- Type-safe request/response

**Database Layer** → Security and data integrity

- Row-Level Security enforces authorization
- PostgreSQL constraints ensure data validity
- Real-time subscriptions for live updates

---

## 🏛️ Project Structure

```
├── app/                              # Next.js App Router
│   ├── api/                          # API Routes
│   │   ├── health/                   # Health check endpoint
│   │   ├── projects/                 # Project CRUD
│   │   │   └── [id]/                 # Single project operations
│   │   ├── user/getCurrent/          # Current user endpoint
│   │   └── users/                    # List users (owners)
│   ├── auth/callback/                # OAuth callback handler
│   ├── dashboard/                    # Dashboard route
│   │   ├── _components/              # Page-specific components
│   │   │   └── DashboardClient.tsx   # Client component (uses context)
│   │   ├── [id]/                     # Project details route
│   │   │   └── _components/          # Detail page components
│   │   ├── layout.tsx                # Wraps children in Provider
│   │   ├── error.tsx                 # Error page
│   │   ├── not-found.tsx             # Not found page
│   │   └── page.tsx                  # Server component entry
│   └── login/                        # Auth page
│
├── components/                       # Shared UI components
│   ├── Alert.tsx                     # Toast notification component
│   ├── ProjectModal/                 # Modal with VM pattern
│   │   ├── ProjectModal.tsx          # Container (logic)
│   │   └── ProjectModalViews.tsx     # Presentational (UI)
│   ├── login/                        # Auth components
│   └── *.tsx                         # Other components
│
├── lib/                              # Business logic & utilities
│   ├── apis/                         # API client functions
│   │   ├── auth.api.ts
│   │   ├── projects.api.ts
│   │   ├── projectDetails.api.ts
│   │   └── users.api.ts
│   ├── hooks/                        # Custom React hooks
│   │   ├── useAlerts.ts              # Toast notification state
│   │   ├── useAuthForm.ts            # Login/signup form logic
│   │   ├── useProjectModal.ts        # Modal form logic
│   │   └── useProjectsRealtime.ts    # Realtime subscriptions
│   ├── providers/                    # Context providers
│   │   ├── ProjectsProvider.tsx      # Dashboard state + alerts
│   │   └── ProjectDetailsProvider.tsx# Detail page state + alerts
│   ├── utils/                        # Pure utility functions
│   │   ├── formatters/
│   │   │   ├── formatBudget.ts
│   │   │   └── formatDate.ts
│   │   ├── supabase/                 # Supabase client setup
│   │   └── pickDefined.ts
│   └── seed.ts                       # Database seeding
│
├── types/                            # TypeScript definitions
│   ├── project.ts                    # Project types & enums
│   └── users.ts                      # User types
│
├── stories/                          # Storybook stories
├── __tests__/                        # Test files
├── supabase/migrations/              # SQL migrations
├── Dockerfile                        # Production container
├── Dockerfile.dev                    # Development container
├── docker-compose.yml                # Container orchestration
├── .husky/pre-commit                 # Development workflow
└── .github/workflows/                # CI/CD pipeline
```

---

## 🔑 Key Architectural Patterns

### 1. Provider Pattern for State Management

State management uses React Context with the Provider pattern. Each feature domain has its own provider:

**`ProjectsProvider`** — Dashboard state (list, filters, pagination, modals, alerts)

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({ children }) {
  return <ProjectsProvider>{children}</ProjectsProvider>;
}

// app/dashboard/_components/DashboardClient.tsx
export default function DashboardClient() {
  const { projects, isLoading, handleCreate, ... } = useProjects();
  // Component just consumes context - no prop drilling!
}
```

**Why this pattern?**

- Eliminates prop drilling through component trees
- Co-locates related state and actions
- Makes components simpler and more testable
- Easy to add new features without touching existing components

---

### 2. Custom Hooks for Reusable Logic

Logic is extracted into reusable hooks:

| Hook                  | Purpose                                   |
| --------------------- | ----------------------------------------- |
| `useAlerts`           | Toast notification state management       |
| `useAuthForm`         | Login/signup form state and validation    |
| `useProjectModal`     | Project modal form state and validation   |
| `useProjectsRealtime` | Supabase realtime subscription management |

**Example: `useProjectsRealtime`** — Smart real-time subscriptions

```typescript
/**
 * Manages real-time project updates via Supabase subscriptions.
 *
 * Smart filtering behavior:
 * - When NO filters are active → Real-time updates automatically refresh the list
 * - When filters ARE active → Real-time is disabled to prevent confusing UX
 */
export function useProjectsRealtime({ onInsert, onUpdate, onDelete, enabled }) {
  useEffect(() => {
    if (!enabled) return;

    const channel = supabase
      .channel("projects-realtime")
      .on("postgres_changes", { event: "INSERT", ... }, onInsert)
      .on("postgres_changes", { event: "UPDATE", ... }, onUpdate)
      .on("postgres_changes", { event: "DELETE", ... }, onDelete)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [enabled, onInsert, onUpdate, onDelete]);
}
```

---

### 3. API Layer Abstraction

HTTP calls are abstracted into a clean API layer:

```typescript
// lib/apis/projects.api.ts
export async function getProjects(params: URLSearchParams) {
  const res = await fetch(`/api/projects?${params}`);
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
}

export async function createProject(data: CreateProjectInput) {
  const res = await fetch("/api/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok)
    throw new Error((await res.json())?.message ?? "Failed to create");
}
```

**Benefits:**

- Single source of truth for API calls
- Easy to mock in tests
- Consistent error handling
- Type-safe request/response

---

## 🗄️ Database Design

### Schema

```
users                              projects
├── id (UUID, PK → auth.users)     ├── id (UUID, PK)
├── name                           ├── name
├── email (unique)                 ├── description
├── avatar_url                     ├── status (enum)
├── created_at                     ├── deadline
└── updated_at                     ├── assigned_to (FK → users.id)
                                   ├── budget
                                   ├── created_at
                                   └── updated_at
```

**Key design decisions:**

- `assigned_to` is a UUID foreign key (not text) for referential integrity
- `status` uses PostgreSQL enum for type safety
- GIN indexes on `name`/`description` for full-text search
- Auto-creating user profiles via database trigger on signup

---

### Row-Level Security (RLS)

Security is enforced at the database level:

```sql
-- Everyone can view all projects
CREATE POLICY "Anyone can view projects" ON projects
  FOR SELECT USING (true);

-- Only owner can insert (must be assigned to self)
CREATE POLICY "Authenticated users can insert projects" ON projects
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = assigned_to);

-- Only owner can update
CREATE POLICY "Users can update own projects" ON projects
  FOR UPDATE TO authenticated
  USING (auth.uid() = assigned_to)
  WITH CHECK (auth.uid() = assigned_to);

-- Only owner can delete
CREATE POLICY "Users can delete own projects" ON projects
  FOR DELETE TO authenticated
  USING (auth.uid() = assigned_to);
```

**Why RLS?**

- Security can't be bypassed, even with API bugs
- Logic lives in one place
- Works for any client (API, direct DB access, etc.)

---

### Realtime Subscriptions

Realtime is enabled on the projects table:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE projects;
```

The `useProjectsRealtime` hook handles subscriptions with smart filtering:

| Scenario          | Behavior                                |
| ----------------- | --------------------------------------- |
| No filters active | Auto-refresh on INSERT/UPDATE/DELETE    |
| Filters active    | Realtime disabled, manual fetch on CRUD |

This prevents confusing UX where a filtered list suddenly changes.

---

## 🛠️ Tech Stack

| Layer          | Technology                   | Why                                          |
| -------------- | ---------------------------- | -------------------------------------------- |
| **Framework**  | Next.js 16 (App Router)      | Server components, API routes, great DX      |
| **Language**   | TypeScript 5                 | Type safety, better tooling, fewer bugs      |
| **Styling**    | Tailwind CSS 4               | Rapid prototyping, consistent design system  |
| **Database**   | PostgreSQL (Supabase)        | Relational data, RLS policies, real-time     |
| **Auth**       | Supabase Auth                | Seamless integration, handles the hard stuff |
| **State**      | React Context + Hooks        | Simple, built-in, no external dependencies   |
| **Testing**    | Jest + React Testing Library | Industry standard, good ecosystem            |
| **Stories**    | Storybook 10                 | Visual component testing, living docs        |
| **CI/CD**      | GitHub Actions               | Native integration, flexible workflows       |
| **Containers** | Docker                       | Consistent environments, easy deployment     |
| **Deployment** | Vercel                       | Zero-config Next.js deployment               |

---

## ✨ Features

### Project Management

- **Create** — Modal form with validation
- **Read** — Table view with owner information
- **Update** — Edit modal pre-filled with data
- **Delete** — Confirmation modal with loading state

### Project Details Page

Click any project to see a dedicated detail view at `/dashboard/[id]`:

- Full project information display
- Edit/Delete actions (owner only)
- Back navigation to dashboard
- Separate provider for isolated state

### Filtering & Search

- **Status filter** — All, Active, On Hold, Completed
- **Owner filter** — Filter by assigned user
- **Search** — Searches name and description
- **Debounced** — 300ms delay prevents API spam

### Real-time Updates

When another user creates/edits/deletes a project:

- If you're not filtering → List auto-updates
- If you're filtering → No interruption, fetch on your next action

### Toast Notifications

Consistent feedback across the entire app:

| Action             | Success                         | Error                      |
| ------------------ | ------------------------------- | -------------------------- |
| **Login**          | "Welcome back!"                 | Error message from API     |
| **Signup**         | "Check your email..."           | Error message from API     |
| **Create project** | "Project created successfully!" | "Failed to create project" |
| **Update project** | "Project updated successfully!" | "Failed to update project" |
| **Delete project** | "Project deleted successfully!" | "Failed to delete project" |
| **Fetch projects** | —                               | "Failed to load projects"  |

Features:

- Auto-dismiss after 5 seconds
- Manual dismiss via X button
- Slide-in animation from right
- Stacked for multiple alerts
- Color-coded: green (success), red (error), blue (info)

### Pagination

- Server-side with configurable page size (default: 10)
- Smart page number display with ellipsis
- "Showing X to Y of Z" indicator

---

## 🧪 Testing Strategy

### Unit Tests

```
__tests__/
├── components/
│   ├── Alert.test.tsx
│   ├── auth/AuthButton.test.tsx
│   ├── DashboardClient.test.tsx
│   ├── DeleteConfirmationModal.test.tsx
│   ├── FilterBar.test.tsx
│   ├── Pagination.test.tsx
│   ├── ProjectDetailsClient.test.tsx
│   ├── ProjectModal.test.tsx
│   ├── ProjectTable.test.tsx
│   └── StatusBadge.test.tsx
├── hooks/
│   └── useAlerts.test.ts
└── helpers/
    ├── formatBudget.test.ts
    └── formatDate.test.ts
```

**Run tests:**

```bash
npm run test              # Run once
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage
```

### Hook Tests

The `useAlerts` hook is tested independently:

```typescript
describe("useAlerts", () => {
  it("starts with empty alerts array");
  it("showSuccess adds a success alert");
  it("showError adds an error alert");
  it("dismissAlert removes alert by id");
  it("generates unique ids for each alert");
  // ...
});
```

### Storybook

Visual component documentation:

```bash
npm run storybook         # Start at localhost:6006
```

Stories include:

- `Alert` — Success, error, info, stacked, interactive
- `StatusBadge` — All status variants
- `Pagination` — Various page states
- `FilterBar` — With/without filters
- `ProjectModal` — Create and edit modes
- `ProjectTable` — Loading, empty, data states
- `DeleteConfirmModal` — Default and loading

---

## 🚀 CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/pipeline.yaml`):

```
┌─────────┐     ┌───────────┐     ┌──────────┐
│  Lint   │     │   Test    │     │ Typecheck│
└─────────┘     └───────────┘     └──────────┘
     │                │                 │
     └────────────────┴─────────────────┘
                      │
               (all in parallel)
```

**Jobs:**

1. **Lint** — ESLint checks
2. **Test** — Jest with coverage, uploads to Codecov
3. **Typecheck** — `tsc --noEmit` for type validation

---

## 🔧 Dev Workflow

Husky provides a quick pre-commit workflow (`.husky/pre-commit`):

**Jobs:**

1. **Lint** - ESLint checks
2. **Typecheck** - Type validation

---

## 🐳 Docker Support

### Production Build

```bash
# Build and run
docker compose up --build app

# Stop and delete container
docker compose down -v
```

### Development with Hot Reload

```bash
docker compose --profile dev up app-dev
```

### Docker Compose

```yaml
services:
  app:
    build:
      context: .
      args:
        - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
        - NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=${NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY}
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test:
        ["CMD", "wget", "-q", "--spider", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### Health Check

```bash
curl http://localhost:3000/api/health

# Response:
{ "status": "healthy", "timestamp": "...", "uptime": 3600 }
```

---

## 💻 Running Locally

### Prerequisites

- Node.js 20+
- npm 9+
- Supabase account (free tier works)

### Setup

```bash
# Clone
git clone https://github.com/ToniAnton22/interview-test.git
cd interview-test

# Install
npm install

# Configure environment
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # For seeding only
NEXT_PUBLIC_SITE_URL=<https://your-domain | http://localhost:3000>
```

### Database Setup

Run migrations in Supabase SQL Editor:

1. **`2023011800100_create_users.sql`** — Users table + trigger
2. **`2024010124524_create_projects.sql`** — Projects table + RLS

Enable Email Auth: **Authentication → Providers → Email**

### Seeding Data

For seeding you will need to provide the SUPABASE_SERVICE_ROLE_KEY. You can find it under Project Settings -> API Keys -> Legacy tab -> Service Role. THIS IS LOCAL ONLY, NEVER SHARE THIS KEY! Do not set it in Vercel.

Only run the command below locally:

```bash
npm run seed
```

Creates 5 test users and 15 sample projects:

| Email             | Password    |
| ----------------- | ----------- |
| alice@example.com | password123 |
| bob@example.com   | password123 |
| carol@example.com | password123 |
| david@example.com | password123 |
| emma@example.com  | password123 |

### Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📜 Available Scripts

| Command                   | Description               |
| ------------------------- | ------------------------- |
| `npm run dev`             | Start development server  |
| `npm run build`           | Build for production      |
| `npm run start`           | Start production server   |
| `npm run lint`            | Run ESLint                |
| `npm run lint:fix`        | Fix ESLint issues         |
| `npm run typecheck`       | Run TypeScript type check |
| `npm run test`            | Run tests                 |
| `npm run test:watch`      | Run tests in watch mode   |
| `npm run test:coverage`   | Run tests with coverage   |
| `npm run storybook`       | Start Storybook           |
| `npm run build-storybook` | Build static Storybook    |
| `npm run seed`            | Seed database             |

---

## 📚 API Reference

### Authentication

All endpoints (except health check) require authentication via Supabase session cookies.

**Authentication Flow:**

1. User logs in via `/login` (Supabase Auth)
2. Session cookie is automatically set
3. API routes verify session via `createServerClient()`
4. Requests without valid session receive `401 Unauthorized`

---

### Projects API

#### **GET** `/api/projects`

Fetch a paginated, filtered list of projects.

**Query Parameters:**

| Parameter  | Type   | Default | Description                                        |
| ---------- | ------ | ------- | -------------------------------------------------- |
| `page`     | number | `1`     | Page number for pagination                         |
| `limit`    | number | `10`    | Items per page (max: 100)                          |
| `status`   | string | -       | Filter by status: `active`, `on_hold`, `completed` |
| `search`   | string | -       | Search in name and description (case-insensitive)  |
| `assignee` | string | -       | Filter by assigned user UUID                       |

**Example Request:**

```bash
GET /api/projects?page=1&limit=10&status=active&search=website&assignee=uuid-here
```

**Success Response (200):**

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Website Redesign",
      "description": "Modernize company website",
      "status": "active",
      "deadline": "2024-12-31",
      "assigned_to": "uuid",
      "budget": 50000,
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-20T14:30:00Z",
      "users": {
        "name": "Alice Smith",
        "email": "alice@example.com",
        "avatar_url": "https://..."
      }
    }
  ],
  "total": 42,
  "page": 1,
  "limit": 10
}
```

**Error Response (401):**

```json
{
  "message": "Unauthorized"
}
```

---

#### **POST** `/api/projects`

Create a new project.

**Request Body:**

| Field         | Type   | Required | Description                              |
| ------------- | ------ | -------- | ---------------------------------------- |
| `name`        | string | ✅       | Project name (max: 255 chars)            |
| `description` | string | ❌       | Project description                      |
| `status`      | string | ✅       | One of: `active`, `on_hold`, `completed` |
| `deadline`    | string | ❌       | ISO date string (YYYY-MM-DD)             |
| `assigned_to` | string | ✅       | User UUID (must be current user)         |
| `budget`      | number | ❌       | Budget in cents (e.g., 50000 = $500.00)  |

**Security Note:**

- `assigned_to` must match the authenticated user's UUID
- Server validates this, and RLS policies enforce it at database level

**Example Request:**

```bash
POST /api/projects
Content-Type: application/json

{
  "name": "Mobile App Development",
  "description": "Build iOS and Android apps",
  "status": "active",
  "deadline": "2024-06-30",
  "assigned_to": "current-user-uuid",
  "budget": 100000
}
```

**Success Response (201):**

```json
{
  "data": {
    "id": "new-uuid",
    "name": "Mobile App Development",
    ...
  }
}
```

**Error Responses:**

**400 - Validation Error:**

```json
{
  "message": "Missing required fields: name, status, assigned_to"
}
```

**403 - Authorization Error:**

```json
{
  "message": "Cannot assign project to another user"
}
```

---

#### **GET** `/api/projects/[id]`

Fetch a single project by ID.

**URL Parameters:**

| Parameter | Type   | Description  |
| --------- | ------ | ------------ |
| `id`      | string | Project UUID |

**Example Request:**

```bash
GET /api/projects/550e8400-e29b-41d4-a716-446655440000
```

**Success Response (200):**

```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Website Redesign",
    "description": "Modernize company website",
    "status": "active",
    "deadline": "2024-12-31",
    "assigned_to": "user-uuid",
    "budget": 50000,
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-20T14:30:00Z",
    "users": {
      "name": "Alice Smith",
      "email": "alice@example.com",
      "avatar_url": "https://..."
    }
  }
}
```

**Error Response (404):**

```json
{
  "message": "Project not found"
}
```

---

#### **PUT** `/api/projects/[id]`

Update an existing project. Only the owner (assigned_to) can update.

**URL Parameters:**

| Parameter | Type   | Description  |
| --------- | ------ | ------------ |
| `id`      | string | Project UUID |

**Request Body:** (All fields optional, only include fields to update)

| Field         | Type   | Description                      |
| ------------- | ------ | -------------------------------- |
| `name`        | string | Project name                     |
| `description` | string | Project description              |
| `status`      | string | `active`, `on_hold`, `completed` |
| `deadline`    | string | ISO date string                  |
| `budget`      | number | Budget in cents                  |

**Security Note:**

- Cannot change `assigned_to` (ownership transfer not supported)
- RLS ensures only the owner can update

**Example Request:**

```bash
PUT /api/projects/550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json

{
  "status": "completed",
  "budget": 55000
}
```

**Success Response (200):**

```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Website Redesign",
    "status": "completed",
    "budget": 55000,
    ...
  }
}
```

**Error Responses:**

**403 - Not Owner:**

```json
{
  "message": "You can only update your own projects"
}
```

**404 - Not Found:**

```json
{
  "message": "Project not found"
}
```

---

#### **DELETE** `/api/projects/[id]`

Delete a project. Only the owner (assigned_to) can delete.

**URL Parameters:**

| Parameter | Type   | Description  |
| --------- | ------ | ------------ |
| `id`      | string | Project UUID |

**Security Note:**

- Hard delete (permanent)
- RLS ensures only the owner can delete

**Example Request:**

```bash
DELETE /api/projects/550e8400-e29b-41d4-a716-446655440000
```

**Success Response (204):**

```
No content
```

**Error Responses:**

**403 - Not Owner:**

```json
{
  "message": "You can only delete your own projects"
}
```

**404 - Not Found:**

```json
{
  "message": "Project not found"
}
```

---

### Users API

#### **GET** `/api/user/getCurrent`

Get the currently authenticated user's profile.

**Example Request:**

```bash
GET /api/user/getCurrent
```

**Success Response (200):**

```json
{
  "data": {
    "id": "user-uuid",
    "name": "Alice Smith",
    "email": "alice@example.com",
    "avatar_url": "https://...",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-15T10:00:00Z"
  }
}
```

**Error Response (401):**

```json
{
  "message": "Unauthorized"
}
```

---

#### **GET** `/api/users`

Get all users (for owner filter dropdown).

**Example Request:**

```bash
GET /api/users
```

**Success Response (200):**

```json
{
  "data": [
    {
      "id": "user-uuid-1",
      "name": "Alice Smith",
      "email": "alice@example.com",
      "avatar_url": "https://..."
    },
    {
      "id": "user-uuid-2",
      "name": "Bob Johnson",
      "email": "bob@example.com",
      "avatar_url": "https://..."
    }
  ]
}
```

**Error Response (401):**

```json
{
  "message": "Unauthorized"
}
```

---

### Health Check

#### **GET** `/api/health`

Health check endpoint for monitoring and load balancers.

**Authentication:** Not required

**Example Request:**

```bash
GET /api/health
```

**Success Response (200):**

```json
{
  "status": "healthy",
  "timestamp": "2024-01-20T15:30:00.000Z",
  "uptime": 3600
}
```

---

### Rate Limiting

Currently no rate limiting is implemented. For production, consider:

- Rate limiting per user/IP
- Request throttling on search/filter endpoints
- Caching for frequently accessed data

---

### Error Handling

All API routes follow a consistent error response format:

```json
{
  "message": "Human-readable error message"
}
```

**Common HTTP Status Codes:**

| Code | Meaning        | When It Happens                  |
| ---- | -------------- | -------------------------------- |
| 200  | OK             | Successful GET/PUT               |
| 201  | Created        | Successful POST                  |
| 204  | No Content     | Successful DELETE                |
| 400  | Bad Request    | Invalid request body/parameters  |
| 401  | Unauthorized   | Not authenticated                |
| 403  | Forbidden      | Authenticated but not authorized |
| 404  | Not Found      | Resource doesn't exist           |
| 500  | Internal Error | Server-side error                |

---

### Testing the API

#### Using cURL

```bash
# Login first to get session cookie
curl -X POST https://interview.bard-labs.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"password123"}' \
  -c cookies.txt

# Then use the cookie for authenticated requests
curl https://interview.bard-labs.com/api/projects \
  -b cookies.txt
```

#### Using Postman/Insomnia

1. Enable cookie handling in settings
2. Make a login request to `/api/auth/login`
3. Subsequent requests will automatically include session cookie

---

### Security Features

| Feature              | Implementation                                  |
| -------------------- | ----------------------------------------------- |
| **Authentication**   | Supabase Auth with HTTP-only session cookies    |
| **Authorization**    | Row-Level Security (RLS) policies in PostgreSQL |
| **Input Validation** | Both client-side and server-side validation     |
| **SQL Injection**    | Prevented via Supabase client parameterization  |
| **XSS Protection**   | React escapes output by default                 |
| **CSRF Protection**  | SameSite cookies + Supabase PKCE flow           |

---

### Real-time Updates

Projects support real-time updates via Supabase subscriptions:

```typescript
// Client subscribes to changes
supabase
  .channel("projects-realtime")
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "projects",
    },
    (payload) => {
      // Handle INSERT, UPDATE, DELETE
    },
  )
  .subscribe();
```

**Smart Filtering:**

- Real-time enabled when NO filters active
- Real-time disabled when filters active (prevents confusing UX)

---

## 🚀 Deployment

### Vercel

1. Push to GitHub
2. Import in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

### Required Environment Variables

| Variable                                       | Description            |
| ---------------------------------------------- | ---------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`                     | Supabase project URL   |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Supabase anon key      |
| `NEXT_PUBLIC_SITE_URL=http://localhost:3000`   | Site URL for callbacks |

**Note:** `SUPABASE_SERVICE_ROLE_KEY` is only needed for local seeding. Never deploy it to production.

---

## 🎯 Requirements Checklist

### Core Requirements ✅

| Requirement                        | Status | Implementation                                        |
| ---------------------------------- | ------ | ----------------------------------------------------- |
| List, filter, search projects      | ✅     | Full filtering by status, owner, search with debounce |
| Status, Deadline, Assigned, Budget | ✅     | All fields + description, timestamps                  |
| React/Next.js + Tailwind           | ✅     | Next.js 16 + Tailwind 4                               |
| Responsive table view              | ✅     | Desktop table, mobile-friendly                        |
| Modal form for add/edit            | ✅     | With validation, error handling                       |
| Next.js API routes                 | ✅     | Full REST API                                         |
| PostgreSQL                         | ✅     | Supabase                                              |
| RESTful endpoints                  | ✅     | CRUD complete                                         |
| Data seeding                       | ✅     | 5 users, 15 projects                                  |

### Bonus Points ✅

| Bonus                   | Status | Implementation               |
| ----------------------- | ------ | ---------------------------- |
| Authentication          | ✅     | Supabase Auth + RLS policies |
| GitHub + commit history | ✅     | Meaningful commits           |
| README                  | ✅     | Comprehensive documentation  |
| Deployment              | ✅     | Vercel-ready                 |
| Containerization        | ✅     | Dockerfile + docker-compose  |

### Beyond Requirements 🚀

| Extra                      | What It Shows                |
| -------------------------- | ---------------------------- |
| Provider pattern           | State management expertise   |
| Custom hooks (4 hooks)     | Clean separation of concerns |
| API layer abstraction      | Maintainable architecture    |
| Realtime updates           | Modern UX                    |
| Toast notifications        | Polished error handling      |
| Row-level security         | Security-first thinking      |
| Unit tests (12 test files) | Quality culture              |
| Hook tests                 | Testing business logic       |
| Storybook (7 stories)      | Component documentation      |
| CI/CD pipeline             | DevOps awareness             |
| Project details page       | Beyond CRUD list             |
| TypeScript enums           | Type safety                  |
| Health check endpoint      | Production-ready             |

---

## 💡 What I Would Add Next

1. **E2E Tests** — Playwright for critical user flows
2. **Optimistic Updates** — Update UI immediately, rollback on error
3. **Activity Log** — Track changes to projects
4. **Export** — CSV/PDF export
5. **Dark Mode** — Theme switching
6. **Bulk Actions** — Select multiple projects
7. **Advanced Filtering** — Date ranges, budget ranges
8. **Project Templates** — Quick-start project creation
