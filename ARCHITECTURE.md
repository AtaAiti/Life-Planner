# Architecture Overview

## System Architecture

Life-Planner is built as a modern single-page application (SPA) with a clean, modular architecture designed for scalability, maintainability, and performance.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Browser/Client                         │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────┐   │
│  │         React Components (TSX/CSS)               │   │
│  │  ┌────────────────────────────────────────────┐  │   │
│  │  │  Pages: Dashboard, Tasks, Projects, etc.   │  │   │
│  │  ├────────────────────────────────────────────┤  │   │
│  │  │  Components: Layout, Shared UI Elements   │  │   │
│  │  └────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │     Zustand State Management                      │   │
│  │  • Central Store (useLifeStore)                  │   │
│  │  • Global State (tasks, habits, projects, etc.)  │   │
│  │  • Theme Management (dark/light mode)            │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │     LocalStorage / Browser Persistence            │   │
│  │  • Automatic data persistence                    │   │
│  │  • Data hydration on app load                    │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Directory Structure

### `/src`
Core application source code organized by feature and responsibility:

```
src/
├── pages/                    # Page-level components (routes)
│   ├── DashboardPage.tsx     # Main dashboard overview
│   ├── TasksPage.tsx         # Task management interface
│   ├── HabitsPage.tsx        # Habit tracking interface
│   ├── ProjectsPage.tsx      # Project management interface
│   ├── CalendarPage.tsx      # Calendar view interface
│   └── [...]
│
├── components/               # Reusable UI components
│   ├── layout/               # Layout components
│   │   ├── Sidebar.tsx       # Navigation sidebar
│   │   ├── MobileNav.tsx     # Mobile navigation
│   │   └── [...]
│   │
│   └── shared/               # Shared UI components
│       ├── Card.tsx          # Card wrapper component
│       ├── Badge.tsx         # Badge component
│       ├── ProgressBar.tsx   # Progress visualization
│       ├── EmptyState.tsx    # Empty state UI
│       └── [...]
│
├── store/                    # State management
│   └── useLifeStore.ts       # Zustand store configuration
│
├── utils/                    # Utility functions
│   ├── date.ts               # Date helper functions
│   ├── habit.ts              # Habit calculations & logic
│   ├── storage.ts            # LocalStorage operations
│   └── [...]
│
├── types.ts                  # Global TypeScript type definitions
├── App.tsx                   # Root application component
├── main.tsx                  # Application entry point
├── index.css                 # Global styles
└── vite-env.d.ts            # Vite environment types
```

## Core Layers

### 1. **Presentation Layer**
- **Pages** (`src/pages/`)
  - Route-level components that combine layouts, components, and state
  - Each page represents a distinct feature area (Tasks, Habits, Projects, Calendar, Dashboard)
  - Responsible for orchestrating user interactions and data display

- **Components** (`src/components/`)
  - Reusable UI building blocks
  - Layout components for structure and navigation
  - Shared components for consistent UI patterns

### 2. **State Management Layer**
- **Zustand Store** (`src/store/useLifeStore.ts`)
  - Centralized state container for all application data
  - Manages: tasks, habits, projects, calendar events, theme, notifications
  - Provides actions for CRUD operations on entities
  - Lightweight and performant alternative to Redux

### 3. **Persistence Layer**
- **LocalStorage Integration** (`src/utils/storage.ts`)
  - Automatic data persistence to browser storage
  - Survives browser refreshes and sessions
  - Auto-hydration on app initialization

### 4. **Utility Layer**
- **Helper Functions** (`src/utils/`)
  - Date operations (formatting, calculations, comparisons)
  - Habit streak computations and validations
  - Storage utilities for data serialization

## Data Flow

### Unidirectional Data Flow
```
User Interaction → Component Handler → Zustand Action → Store Update
                                                              ↓
                                                        Component Re-render
                                                              ↓
                                                        LocalStorage Persist
```

### Example: Creating a Task
1. User fills form in TasksPage
2. Form submission triggers `addTask()` action
3. Zustand updates `tasks` array in store
4. Component re-renders with new task
5. `useEffect` hook triggers `saveLifeData()` to persist
6. Data saved to LocalStorage

## State Management Details

### useLifeStore Structure
```typescript
// Core data entities
- tasks: Task[]
- habits: Habit[]
- projects: Project[]
- calendar: CalendarEvent[]

// UI state
- theme: 'light' | 'dark'
- notification: Notification | null

// Actions
- addTask, updateTask, deleteTask
- addHabit, updateHabit, deleteHabit
- addProject, updateProject, deleteProject
- recomputeHabitStreaks()
- setTheme()
- showNotification(), dismissNotification()
```

## Routing

### Route Structure
Using React Router v7 for SPA routing:

- `/` — Dashboard (home page)
- `/tasks` — Task management
- `/habits` — Habit tracking
- `/projects` — Project management
- `/calendar` — Calendar view

### Navigation
- **Sidebar** — Desktop primary navigation
- **Mobile Navigation** — Mobile-optimized menu
- **Programmatic** — React Router `navigate()` for dynamic routing

## Styling Architecture

### Tailwind CSS
- **Utility-first approach** for rapid UI development
- **Custom configuration** in `tailwind.config.cjs`
- **PostCSS pipeline** for CSS processing
- **Responsive design** with mobile-first strategy
- **Dark mode support** via Tailwind's dark mode feature

### CSS Structure
```
index.css
├── Global styles
├── Tailwind directives
├── Custom utilities
└── Theme variables
```

## Build Pipeline

### Development
- **Vite Dev Server** with HMR (Hot Module Replacement)
- Instant feedback during development
- Source maps for debugging

### Production
```bash
npm run build
├── TypeScript compilation (tsc)
├── Code bundling (Vite)
├── Code splitting for optimization
├── CSS minification
└── Output to /dist directory
```

## Performance Optimizations

1. **Code Splitting** — Route-based code splitting via Vite
2. **Memoization** — `useMemo` for expensive computations
3. **Lazy Loading** — Component and route lazy loading
4. **State Slicing** — Zustand selector pattern to avoid unnecessary re-renders
5. **LocalStorage** — Instant persistence without server requests

## Type Safety

- **TypeScript 5.8.3** with strict mode enabled
- **Type definitions** in `src/types.ts`
- **Compiled to JavaScript** for browser execution
- **Type checking** during build process

## Browser Compatibility

- Modern browsers supporting ES2020+
- React 19+ requirements
- LocalStorage API support required
- CSS Grid and Flexbox support

## Responsive Design

- **Mobile-first approach**
- **Breakpoints:**
  - Mobile: < 768px (Sidebar hidden, MobileNav visible)
  - Tablet: 768px - 1024px (Responsive layout)
  - Desktop: > 1024px (Full layout with Sidebar)

## Daily Habit Streak Reset

- **Automatic detection** of date changes
- **Minute-level interval check** (60-second polling)
- **Triggers streak recomputation** on new day
- **No server required** for client-side scheduling

## Error Handling

- **Component-level error boundaries** (optional)
- **Form validation** before state updates
- **User notifications** for errors and confirmations
- **Console logging** for debugging

## Testing Considerations

- **Unit tests** for utility functions
- **Component tests** for UI behavior
- **Integration tests** for state management flow
- **E2E tests** for critical user workflows
