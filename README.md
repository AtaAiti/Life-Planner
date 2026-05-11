# Life-Planner — Comprehensive Life & Task Management Platform

**Life-Planner** is a modern, fast, and intuitive web application designed to help users organize their entire life in one place. Seamlessly manage your tasks, projects, habits, and calendar events while tracking progress with beautiful visualizations and meaningful insights. Built for productivity enthusiasts who value simplicity and performance.

## ✨ Features

- 📝 **Task Management** — Create, organize, and track tasks with priorities and due dates
- 🎯 **Project Management** — Group tasks into projects and monitor progress
- 🔥 **Habit Tracking** — Build habits with streak counting and daily reminders
- 📅 **Calendar Integration** — Visualize events, tasks, and habits in calendar view
- 📊 **Dashboard** — Get an overview of your entire life at a glance
- 🌙 **Dark Mode** — Easy on the eyes with built-in light/dark theme support
- ⚡ **Blazing Fast** — Instant loading, smooth interactions, offline-first
- 💾 **Local Storage** — All data stored locally on your device

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Aiatulla/life-planner.git
cd life-planner
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```
The app will open at `http://localhost:5173`

## 📦 Build for Production

```bash
npm run build        # Create optimized production build
npm run preview      # Preview the production build locally
```

The production-ready files will be in the `/dist` directory.

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
