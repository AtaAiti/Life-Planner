import { useEffect, useMemo } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { MobileNav } from "@/components/layout/MobileNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardPage } from "@/pages/DashboardPage";
import { TasksPage } from "@/pages/TasksPage";
import { HabitsPage } from "@/pages/HabitsPage";
import { CalendarPage } from "@/pages/CalendarPage";
import { ProjectsPage } from "@/pages/ProjectsPage";
import { useLifeStore } from "@/store/useLifeStore";
import { saveLifeData } from "@/utils/storage";

const App = () => {
  const theme = useLifeStore((s) => s.theme);
  const notification = useLifeStore((s) => s.notification);
  const dismissNotification = useLifeStore((s) => s.dismissNotification);
  const recomputeHabitStreaks = useLifeStore((s) => s.recomputeHabitStreaks);
  const tasks = useLifeStore((s) => s.tasks);
  const habits = useLifeStore((s) => s.habits);
  const projects = useLifeStore((s) => s.projects);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    saveLifeData({ tasks, habits, projects, theme });
  }, [tasks, habits, projects, theme]);

  useEffect(() => {
    let day = new Date().getDate();
    const timer = setInterval(() => {
      const now = new Date();
      if (now.getDate() !== day) {
        day = now.getDate();
        recomputeHabitStreaks();
      }
    }, 60000);
    return () => clearInterval(timer);
  }, [recomputeHabitStreaks]);

  const classes = useMemo(
    () =>
      theme === "dark"
        ? "min-h-screen bg-app-darkBg text-stone-100 transition-colors duration-320"
        : "min-h-screen bg-app-lightBg text-stone-800 transition-colors duration-320",
    [theme]
  );

  return (
    <div className={classes}>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="w-full px-4 pb-24 pt-4 lg:px-8 lg:pb-8 lg:pt-8">
          {notification && (
            <div className="mb-4 flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-950/30 dark:text-amber-200">
              <span>{notification}</span>
              <button onClick={dismissNotification} className="font-medium underline">
                Ок
              </button>
            </div>
          )}
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/habits" element={<HabitsPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
      <MobileNav />
    </div>
  );
};

export default App;
