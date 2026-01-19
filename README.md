# Mini SaaS Dashboard

A production-ready project management dashboard built as a full-stack developer assessment. This project demonstrates clean architecture, proper separation of concerns, real-time updates, toast notifications, and comprehensive testing.

**Live Demo (Hosted on my domain through a subdomain):** [https://interview.bard-labs.com](https://interview.bard-labs.com)
**Live Demo (Vercel Link):** [interview-test-roan.vercel.app](interview-test-roan.vercel.app)

> **Test Account:** `alice@example.com` / `password123`

---

## Table of Contents

- [What This Project Demonstrates](#what-this-project-demonstrates)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
  - [Project Structure](#project-structure)
  - [Layer Separation](#layer-separation)
  - [Provider Pattern](#provider-pattern)
  - [Custom Hooks](#custom-hooks)
  - [API Layer](#api-layer)
- [Database Design](#database-design)
  - [Schema](#schema)
  - [Row-Level Security](#row-level-security)
  - [Realtime](#realtime)
- [Features](#features)
  - [Project Management](#project-management)
  - [Project Details Page](#project-details-page)
  - [Filtering & Search](#filtering--search)
  - [Real-time Updates](#real-time-updates)
  - [Toast Notifications](#toast-notifications)
  - [Pagination](#pagination)
- [Testing Strategy](#testing-strategy)
  - [Unit Tests](#unit-tests)
  - [Hook Tests](#hook-tests)
  - [Storybook](#storybook)
- [CI/CD Pipeline](#cicd-pipeline)
- [Docker Support](#docker-support)
- [Running Locally](#running-locally)
- [Available Scripts](#available-scripts)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [What I Would Add Next](#what-i-would-add-next)

---

## What This Project Demonstrates

| #   | Skill                   | Implementation                                                                                                        |
| --- | ----------------------- | --------------------------------------------------------------------------------------------------------------------- |
| 1   | **Clean Architecture**  | Clear separation between UI, business logic, and data layers                                                          |
| 2   | **Provider Pattern**    | Context-based state management without prop drilling                                                                  |
| 3   | **Custom Hooks**        | Reusable logic extracted into composable hooks (`useAlerts`, `useAuthForm`, `useProjectModal`, `useProjectsRealtime`) |
| 4   | **API Abstraction**     | HTTP calls isolated in a dedicated API layer                                                                          |
| 5   | **Real-time Updates**   | Supabase realtime subscriptions with smart filtering                                                                  |
| 6   | **Toast Notifications** | Consistent error/success feedback across the app                                                                      |
| 7   | **Type Safety**         | Full TypeScript with strict typing and enums                                                                          |
| 8   | **Security First**      | Row-level security policies at the database level                                                                     |
| 9   | **Testing Culture**     | Unit tests, hook tests, and Storybook stories                                                                         |
| 10  | **DevOps Awareness**    | CI/CD pipeline, Docker support, health checks                                                                         |

---

## Tech Stack

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

## Architecture Overview

### Project Structure

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
│   │   ├── error.tsx                 # Error page.
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
│   ├── Alert.stories.tsx             # Toast notification stories
│   ├── StatusBadge.stories.tsx
│   ├── Pagination.stories.tsx
│   ├── FilterBar.stories.tsx
│   ├── ProjectModal.stories.tsx
│   ├── ProjectTable.stories.tsx
│   └── DeleteConfirmModal.stories.tsx
│
├── __tests__/                        # Test files
│   ├── components/                   # Component tests
│   │   ├── Alert.test.tsx
│   │   ├── StatusBadge.test.tsx
│   │   ├── Pagination.test.tsx
│   │   └── ...
│   ├── hooks/                        # Hook tests
│   │   └── useAlerts.test.ts
│   └── helpers/                      # Utility tests
│       ├── formatBudget.test.ts
│       └── formatDate.test.ts
│
├── supabase/migrations/              # SQL migrations
├── Dockerfile                        # Production container
├── Dockerfile.dev                    # Development container
├── docker-compose.yml                # Container orchestration
├── .husky/pre-commit                 # Development workflow
└── .github/workflows/                # CI/CD pipeline

```

### Layer Separation

The architecture follows a clean separation of concerns:

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

### Provider Pattern

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

**`ProjectDetailsProvider`** — Single project state (view, edit, delete, alerts)

```tsx
// Wraps individual project pages
<ProjectDetailsProvider id={id}>
  <ProjectDetailsView />
</ProjectDetailsProvider>
```

**Why this pattern?**

- Eliminates prop drilling through component trees
- Co-locates related state and actions
- Makes components simpler and more testable
- Easy to add new features without touching existing components

### Custom Hooks

Logic is extracted into reusable hooks:

| Hook                  | Purpose                                   |
| --------------------- | ----------------------------------------- |
| `useAlerts`           | Toast notification state management       |
| `useAuthForm`         | Login/signup form state and validation    |
| `useProjectModal`     | Project modal form state and validation   |
| `useProjectsRealtime` | Supabase realtime subscription management |

**`useAlerts`** — Toast notifications

```typescript
export function useAlerts() {
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);

  const showSuccess = (message: string) => {
    /* ... */
  };
  const showError = (message: string) => {
    /* ... */
  };
  const showInfo = (message: string) => {
    /* ... */
  };
  const dismissAlert = (id: string) => {
    /* ... */
  };

  return { alerts, showSuccess, showError, showInfo, dismissAlert };
}
```

**`useProjectsRealtime`** — Supabase realtime subscription

```typescript
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

### API Layer

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

## Database Design

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

### Row-Level Security

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

### Realtime

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

## Features

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

## Testing Strategy

### Unit Tests

```
__tests__/
├── components/
│   ├── Alert.test.tsx              # Toast notifications
│   ├── auth/AuthButton.test.tsx    # Auth button
│   ├── DashboardClient.test.tsx    # Dashboard wiring
│   ├── DeleteConfirmationModal.test.tsx
│   ├── FilterBar.test.tsx
│   ├── Pagination.test.tsx
│   ├── ProjectDetailsClient.test.tsx
│   ├── ProjectModal.test.tsx
│   ├── ProjectTable.test.tsx
│   └── StatusBadge.test.tsx
├── hooks/
│   └── useAlerts.test.ts           # Alert hook logic
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

## CI/CD Pipeline

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

## Dev Workflow

Husky provides a quick and small dev workflow with checks before allowing the user to commit (`.husky/pre-commit`);

**Jobs:**

1. **Lint** - ESLint checks
2. **Typecheck** - For validating types

## Docker Support

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

## Running Locally

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
```

### Database Setup

Run migrations in Supabase SQL Editor:

1. **`2023011800100_create_users.sql`** — Users table + trigger
2. **`2024010124524_create_projects.sql`** — Projects table + RLS

Enable Email Auth: **Authentication → Providers → Email**

### Seeding Data

For seeding you will need to provide the SUPABASE_SERVICE_ROLE_KEY. You can find it under Project Settings -> API Keys -> Legacy tab -> Service Role. THIS IS LOCAL ONLY, NEVER SHARE THIS KEY! Do not set it in Verce.

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

## Available Scripts

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

## API Reference

### Projects

| Method | Endpoint                                                                   | Description        |
| ------ | -------------------------------------------------------------------------- | ------------------ |
| GET    | `/api/projects?page=1&limit=10&status=active&search=keyword&assignee=uuid` | List projects      |
| POST   | `/api/projects`                                                            | Create project     |
| GET    | `/api/projects/[id]`                                                       | Get single project |
| PUT    | `/api/projects/[id]`                                                       | Update project     |
| DELETE | `/api/projects/[id]`                                                       | Delete project     |

### Users

| Method | Endpoint               | Description                       |
| ------ | ---------------------- | --------------------------------- |
| GET    | `/api/user/getCurrent` | Get authenticated user            |
| GET    | `/api/users`           | List all users (for owner filter) |

### Health

| Method | Endpoint      | Description  |
| ------ | ------------- | ------------ |
| GET    | `/api/health` | Health check |

---

## Deployment

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
| `SUPABASE_SERVICE_ROLE_KEY`                    | Seed only supabase key |

---

## What I Could Add Next

1. ~~**Toast Notifications**~~ ✅ Done!
2. **E2E Tests** — Playwright for critical user flows
3. **Optimistic Updates** — Update UI immediately, rollback on error
4. **Activity Log** — Track changes to projects
5. **Export** — CSV/PDF export
6. **Dark Mode** — Theme switching
7. **Bulk Actions** — Select multiple projects

---

## Summary: Requirements vs Implementation

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
| Provider pattern           | State management             |
| Custom hooks (4 hooks)     | Clean separation of concerns |
| API layer abstraction      | Maintainable architecture    |
| Realtime updates           | Modern UX                    |
| Toast notifications        | Polished error handling      |
| Row-level security         | Security-first thinking      |
| Unit tests (12 test files) | Quality culture              |
| Hook tests                 | Testing business logic       |
| Storybook (7 stories)      | Component documentation      |
| CI/CD pipeline             | DevOps                       |
| Project details page       | Beyond CRUD list             |
| TypeScript enums           | Type safety                  |
| Health check endpoint      | Production-ready             |

---
