# Life-Planner — Comprehensive Life & Task Management Platform

Life-Planner is a modern, fast, and intuitive web application designed to help users organize their entire life in one place. Seamlessly manage your tasks, projects, habits, and calendar events while tracking progress with beautiful visualizations and meaningful insights. Built for productivity enthusiasts who value simplicity and performance.

## 🏗️ Project Architecture

Life-Planner is a single-page application (SPA) built with modern web technologies and best practices for code organization and maintainability.

**Core Structure:**
- `src/pages/` — Main page components (Dashboard, Tasks, Projects, Habits, Calendar)
- `src/components/` — Reusable UI components (layout, shared widgets)
- `src/store/` — Centralized state management using Zustand
- `src/utils/` — Helper functions and utilities
- `src/types.ts` — TypeScript type definitions
- `dist/` — Production build output

## 💻 Tech Stack

**Frontend Hub**
- **Framework:** React 19.1.0 with TypeScript
- **Build Tool:** Vite 6.3.5 (lightning-fast bundling & HMR)
- **Styling:** Tailwind CSS 3.4.17 with PostCSS & Autoprefixer
- **State Management:** Zustand 5.0.4 (lightweight & intuitive)
- **Routing:** React Router DOM 7.6.0
- **Date Utilities:** date-fns 4.1.0 (modern date handling)
- **Icons:** Lucide React 0.511.0 (beautiful, consistent icons)
- **Utilities:** clsx 2.1.1 (conditional className composition)

**Type Safety**
- Strict TypeScript 5.8.3 configuration
- Full type coverage across all modules
- Enhanced IntelliSense and IDE support

**Key Features**
- ✅ Task Management — Create, organize, and track tasks with priority levels
- 📋 Project Management — Group tasks into projects for better organization
- 🎯 Habit Tracking — Build and monitor daily/weekly habits
- 📅 Calendar Integration — Visualize tasks and events on an interactive calendar
- 📊 Dashboard Insights — Real-time statistics and progress overview
- 💾 Persistent Storage — Local storage integration for data persistence
- 📱 Responsive Design — Fully responsive UI for desktop and mobile devices
- 🎨 Modern UI — Clean, accessible design with Tailwind CSS

## 🚀 How to Run the Project Locally

### Prerequisites
- **Node.js:** v18 or higher
- **npm:** v9 or higher (comes with Node.js)

### 1. Clone the Repository

```bash
git clone https://github.com/AtaAiti/Life-Planner.git
cd Life-Planner
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Development Server

```bash
npm run dev
```

The application will spin up on **http://localhost:5173** (Vite's default port). The development server includes:
- Hot Module Replacement (HMR) for instant updates
- TypeScript compilation with error reporting
- Tailwind CSS JIT compilation

### 4. Build for Production

```bash
npm run build
```

This command:
- Compiles TypeScript (`tsc -b`)
- Bundles the application with Vite (`vite build`)
- Outputs optimized files to the `dist/` directory

### 5. Preview the Production Build

```bash
npm run preview
```

Serves the production build locally for testing before deployment.

## 📁 Project Structure

```
Life-Planner/
├── src/
│   ├── pages/               # Page components
│   │   ├── DashboardPage.tsx
│   │   ├── TasksPage.tsx
│   │   ├── ProjectsPage.tsx
│   │   ├── HabitsPage.tsx
│   │   └── CalendarPage.tsx
│   ├── components/          # Reusable components
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   └── MobileNav.tsx
│   │   └── shared/
│   │       ├── Card.tsx
│   │       ├── Badge.tsx
│   │       ├── ProgressBar.tsx
│   │       └── EmptyState.tsx
│   ├── store/               # State management
│   │   └── useLifeStore.ts  # Zustand store
│   ├── utils/               # Utility functions
│   │   ├── date.ts
│   │   ├── habit.ts
│   │   └── storage.ts
│   ├── types.ts             # TypeScript types
│   ├── App.tsx              # Root component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── dist/                    # Production build (generated)
├── index.html               # HTML template
├── vite.config.ts           # Vite configuration
├── tailwind.config.cjs      # Tailwind CSS configuration
├── postcss.config.cjs       # PostCSS configuration
├── tsconfig.json            # TypeScript configuration
├── tsconfig.app.json        # App-specific TypeScript config
├── tsconfig.node.json       # Node.js TypeScript config
├── package.json             # Project dependencies & scripts
├── .gitignore               # Git ignore rules
└── README.md                # This file
```

## 🛠️ Development Workflow

### Adding New Features

1. **Create components** in `src/components/` or `src/pages/`
2. **Define types** in `src/types.ts` or component-local types
3. **Update store** in `src/store/useLifeStore.ts` if state management is needed
4. **Style with Tailwind CSS** — Use semantic utility classes
5. **Test locally** with `npm run dev`

### Code Style

- **TypeScript:** Strict mode enabled for type safety
- **Components:** Functional React components with hooks
- **Styling:** Tailwind CSS utility-first approach
- **State:** Zustand for simple, effective state management
- **Icons:** Lucide React for consistent iconography

## 📦 Deployment

Life-Planner can be deployed to any static hosting platform:

- **Vercel:** Zero-config deployment for Vite projects
- **Netlify:** Connect GitHub repository for auto-deployments
- **GitHub Pages:** Build and deploy via GitHub Actions
- **AWS S3 + CloudFront:** Manual upload of `dist/` folder
- **Traditional Hosting:** Upload `dist/` folder contents to any web server

### Pre-deployment Checklist

```bash
# 1. Run the build
npm run build

# 2. Test the production build
npm run preview

# 3. Check for TypeScript errors
npm run build

# 4. Commit and push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main
```

## 🤝 Contributing

Contributions are welcome! Follow these guidelines:

1. **Fork** the repository
2. **Create a feature branch:** `git checkout -b feature/your-feature`
3. **Make your changes** with clear, descriptive commits
4. **Test thoroughly** with `npm run dev`
5. **Build successfully:** `npm run build` (no errors or warnings)
6. **Push and create a Pull Request** with detailed description

## 📝 License

This project is open source and available under the MIT License. See LICENSE file for details.

## 👥 Author

**AtaAiti** — [GitHub](https://github.com/AtaAiti)

---

**Built with ❤️ using React, Vite, and Tailwind CSS**
