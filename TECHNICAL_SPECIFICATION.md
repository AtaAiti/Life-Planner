# Technical Specification

## System Requirements

### Development Environment
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 or **yarn** >= 3.0.0
- **TypeScript** 5.8.3 or higher

### Runtime Requirements
- Modern web browser with ES2020+ support
- LocalStorage API (minimum 5MB)
- CSS Grid and Flexbox support

## Technology Stack

### Frontend Framework
| Component | Library | Version |
|-----------|---------|---------|
| UI Framework | React | 19.1.0 |
| Language | TypeScript | ~5.8.3 |
| Build Tool | Vite | 6.3.5 |
| State Management | Zustand | 5.0.4 |
| Routing | React Router DOM | 7.6.0 |
| Styling | Tailwind CSS | 3.4.17 |
| Date Handling | date-fns | 4.1.0 |
| Icons | Lucide React | 0.511.0 |
| Utilities | clsx | 2.1.1 |

### Build Tools & Config
| Tool | Purpose | Version |
|------|---------|---------|
| Vite | Module bundler & dev server | 6.3.5 |
| TypeScript | Type checking & transpilation | 5.8.3 |
| PostCSS | CSS processing | 8.5.3 |
| Autoprefixer | CSS vendor prefixes | 10.4.21 |
| Tailwind CSS | Styling framework | 3.4.17 |

## Architecture Specifications

### Component Architecture

#### Page Components
Located in `src/pages/`:
- **DashboardPage** — Overview and quick stats
- **TasksPage** — Task CRUD operations
- **HabitsPage** — Habit tracking interface
- **ProjectsPage** — Project management
- **CalendarPage** — Calendar view

Specifications:
- Self-contained feature modules
- Connect to global Zustand store
- Route-level components with full-page scope

#### Layout Components
Located in `src/components/layout/`:

**Sidebar**
```typescript
Props:
- none (reads store directly)
Returns: Navigation menu (desktop)
Responsive: Hidden on mobile
Uses: React Router Link for navigation
```

**MobileNav**
```typescript
Props:
- none (reads store directly)
Returns: Bottom tab navigation (mobile)
Responsive: Visible on mobile only
Breakpoint: < 768px
```

#### Shared Components
Located in `src/components/shared/`:

**Card**
```typescript
Props:
- children: ReactNode
- className?: string
Returns: Styled card wrapper
Used for: Consistent card layouts
```

**Badge**
```typescript
Props:
- children: ReactNode
- variant?: 'default' | 'success' | 'warning' | 'danger'
Returns: Small label component
Used for: Status, priority, category labels
```

**ProgressBar**
```typescript
Props:
- value: number (0-100)
- variant?: 'default' | 'success' | 'warning'
- animated?: boolean
Returns: Animated progress visualization
Used for: Project progress, habit streaks
```

**EmptyState**
```typescript
Props:
- icon?: ReactNode
- title: string
- description?: string
- action?: ReactNode
Returns: Empty state placeholder
Used for: No tasks, no habits, etc.
```

### State Management Specification

#### Zustand Store Configuration

**Store Location:** `src/store/useLifeStore.ts`

**State Shape:**
```typescript
{
  // Data entities
  tasks: Task[]
  habits: Habit[]
  projects: Project[]
  
  // UI state
  theme: 'light' | 'dark'
  notification: Notification | null
  
  // Actions
  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  completeTask: (id: string) => void
  
  // Habit actions
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => void
  updateHabit: (id: string, updates: Partial<Habit>) => void
  deleteHabit: (id: string) => void
  completeHabit: (id: string) => void
  recomputeHabitStreaks: () => void
  
  // Project actions
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
  
  // UI actions
  setTheme: (theme: 'light' | 'dark') => void
  showNotification: (notif: Notification) => void
  dismissNotification: () => void
}
```

**Selector Pattern:**
```typescript
// Efficient selectors to prevent unnecessary re-renders
const tasks = useLifeStore((state) => state.tasks)
const addTask = useLifeStore((state) => state.addTask)
```

### Persistence Layer

#### LocalStorage Configuration

**Storage Key:** `life-planner-data`

**Data Structure:**
```typescript
{
  tasks: Task[]
  habits: Habit[]
  projects: Project[]
  theme: 'light' | 'dark'
  version: number  // For future migrations
}
```

**Save Triggers:**
- On component mount
- After store updates
- On page visibility change

**Load Triggers:**
- App initialization (App.tsx useEffect)
- Store initialization

**Utility Functions (`src/utils/storage.ts`):**
```typescript
export function saveLifeData(data: LifeData): void
export function loadLifeData(): LifeData | null
export function clearLifeData(): void
export function getStorageSize(): number  // Debugging
```

## Data Type Specifications

### Task Type
```typescript
interface Task {
  id: string
  title: string
  description?: string
  dueDate?: Date
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'todo' | 'in-progress' | 'completed'
  projectId?: string
  createdAt: Date
  completedAt?: Date
}
```

**Validation Rules:**
- Title: Required, 1-255 characters
- Priority: Default 'medium'
- Status: Default 'todo'
- DueDate: Optional, must be future date
- ProjectId: Must match existing project

### Habit Type
```typescript
interface Habit {
  id: string
  title: string
  description?: string
  frequency: 'daily' | 'weekly'
  streak: number
  lastCompletedDate?: Date
  createdAt: Date
}
```

**Validation Rules:**
- Title: Required, 1-255 characters
- Frequency: Default 'daily'
- Streak: Auto-calculated, minimum 0
- LastCompletedDate: Auto-updated on completion

### Project Type
```typescript
interface Project {
  id: string
  name: string
  description?: string
  color?: string
  progress: number  // 0-100
  status: 'active' | 'completed' | 'archived'
  createdAt: Date
}
```

**Validation Rules:**
- Name: Required, 1-255 characters
- Progress: Auto-calculated or manual (0-100)
- Color: Optional, hex color code
- Status: Default 'active'

### CalendarEvent Type
```typescript
interface CalendarEvent {
  id: string
  title: string
  date: Date
  time?: string
  description?: string
  type: 'task' | 'habit' | 'event'
  sourceId?: string  // Link to Task/Habit
}
```

## API Specifications

### Route Specifications

#### Dashboard Route (`/`)
- **Component:** DashboardPage
- **Data:** All entities (tasks, habits, projects)
- **Purpose:** Overview and quick stats
- **Responsive:** Full responsive design

#### Tasks Route (`/tasks`)
- **Component:** TasksPage
- **Data:** All tasks, projects
- **Features:** Create, read, update, delete, filter
- **Responsive:** Full responsive design

#### Habits Route (`/habits`)
- **Component:** HabitsPage
- **Data:** All habits
- **Features:** Create, read, update, delete, track completion
- **Responsive:** Full responsive design

#### Projects Route (`/projects`)
- **Component:** ProjectsPage
- **Data:** All projects, tasks
- **Features:** Create, read, update, delete, progress tracking
- **Responsive:** Full responsive design

#### Calendar Route (`/calendar`)
- **Component:** CalendarPage
- **Data:** Calendar events, tasks, habits
- **Features:** Month view, event creation, navigation
- **Responsive:** Full responsive design

## Styling Specifications

### Tailwind Configuration

**File:** `tailwind.config.cjs`

**Key Configuration:**
```javascript
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Custom color palette
      colors: {
        'app-darkBg': '#1a1a1a',  // Dark mode background
        // Additional custom colors
      }
    }
  },
  darkMode: 'class',  // Dark mode via class
  plugins: []
}
```

### CSS Architecture

**Global Styles (`src/index.css`):**
- Tailwind directives
- Custom utility classes
- Theme variables
- Reset styles

**Component Styling:**
- Tailwind utility classes in JSX
- clsx for conditional classes
- BEM naming for complex styles

**Responsive Breakpoints:**
```
Mobile-first:
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### Dark Mode

**Implementation:**
- Tailwind dark mode class strategy
- Toggle via `setTheme()` action
- Persistent theme preference

**Application:**
```typescript
// In App.tsx
if (theme === 'dark') {
  root.classList.add('dark')
} else {
  root.classList.remove('dark')
}
```

## Performance Specifications

### Bundle Size Targets
- Main JS: < 300KB (gzipped)
- CSS: < 50KB (gzipped)
- Total: < 350KB (gzipped)

### Rendering Performance
- Time to First Contentful Paint: < 1s
- Time to Interactive: < 2s
- Lighthouse Performance Score: > 90

### Memory Optimization
- LocalStorage limit: 5-10MB
- Component memoization: Strategic use of useMemo
- No memory leaks: Proper cleanup in useEffect

## Build Specifications

### Development Build
```bash
npm run dev
```
- Vite dev server on http://localhost:5173
- Hot Module Replacement (HMR)
- Source maps for debugging
- No minification

### Production Build
```bash
npm run build
```
- TypeScript compilation
- Code minification
- Tree shaking
- Asset optimization
- Output: `/dist` directory

**Build Steps:**
1. Run `tsc -b` for type checking
2. Run Vite build process
3. Generate optimized bundles
4. Create source maps (optional)

### Preview Build
```bash
npm run preview
```
- Local preview of production build
- For testing before deployment

## Type Safety Specifications

### TypeScript Configuration

**File:** `tsconfig.json`

**Strict Mode Enabled:**
```json
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "target": "ES2020"
  }
}
```

**Strict Checks:**
- noImplicitAny: true
- strictNullChecks: true
- strictFunctionTypes: true
- strictBindCallApply: true
- strictPropertyInitialization: true

## Browser Compatibility

### Supported Browsers
- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: Latest versions

### Polyfills
- None required (ES2020 support assumed)

## Security Specifications

### Content Security
- No eval() usage
- XSS prevention via React escaping
- CSRF not applicable (no server)

### Data Security
- LocalStorage (client-side only)
- No transmission of sensitive data
- No external API calls

### HTTPS
- Recommended for production
- No requirement for HTTPS (local storage only)

## Testing Specifications

### Unit Testing (Recommended)
- Framework: Jest or Vitest
- Coverage: > 80%
- Utilities and helpers

### Component Testing (Recommended)
- Framework: React Testing Library
- Critical user paths
- UI interactions

### Integration Testing (Recommended)
- Store + component integration
- LocalStorage persistence
- State synchronization

### E2E Testing (Optional)
- Framework: Cypress or Playwright
- Critical workflows
- Cross-browser testing

## Deployment Specifications

### Hosting Requirements
- Static file hosting
- HTTPS support (recommended)
- CDN support (recommended)
- No server-side rendering needed

### Recommended Platforms
- Vercel (optimal for Vite)
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

### Environment Variables
Currently not in use; can be added for:
- API endpoints (if backend added)
- Analytics keys
- Build information

## Monitoring & Analytics

### Recommended Tools
- Google Analytics (user tracking)
- Sentry (error tracking)
- Web Vitals (performance)
- LogRocket (session replay)

### Metrics to Track
- Daily/monthly active users
- Feature adoption rates
- Error frequency
- Performance metrics (Core Web Vitals)

## Version Control

### Git Strategy
- Feature branches for new features
- Commit messages: Conventional commits
- Pull requests for code review
- Main branch: Production-ready code

### Branching Model
```
main (production)
  ↑
  ├─ develop (staging)
  │   ↑
  │   ├─ feature/task-xyz
  │   ├─ feature/habit-abc
  │   └─ bugfix/issue-123
```

## Documentation Standards

### Code Comments
- Complex logic explanation
- Type parameter documentation
- Hack/workaround notation

### README Sections
- Setup instructions
- Available scripts
- Tech stack overview
- Contribution guidelines

### Inline Documentation
- JSDoc for components
- Type annotations
- Clear variable naming

## Maintenance & Upgrades

### Dependency Updates
- Monthly security patch reviews
- Quarterly minor version updates
- Test after each update
- CHANGELOG documentation

### Type Definitions
- Keep aligned with libraries
- Update @types packages
- Custom types in types.ts

### Backward Compatibility
- Maintain LocalStorage format
- Migration functions for breaking changes
- Version number in storage data

## Performance Optimization Checklist

- [ ] Code splitting by route
- [ ] Image optimization
- [ ] CSS critical path
- [ ] JavaScript minification
- [ ] Memoization of expensive components
- [ ] Lazy loading where applicable
- [ ] LocalStorage efficiency
- [ ] No unnecessary re-renders

## Conclusion

This technical specification provides comprehensive details for the Life-Planner project architecture, tools, and best practices. Follow these specifications for consistency and maintainability across the codebase.
