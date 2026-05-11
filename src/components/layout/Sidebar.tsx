import { Link, NavLink } from "react-router-dom";
import { Calendar, CheckSquare, Download, Home, Moon, Repeat, Sun, Folder } from "lucide-react";
import { useLifeStore } from "@/store/useLifeStore";

const navItems = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/projects", label: "Projects", icon: Folder },
  { to: "/habits", label: "Habits", icon: Repeat },
  { to: "/calendar", label: "Calendar", icon: Calendar }
] as const;

export const Sidebar = () => {
  const projects = useLifeStore((s) => s.projects);
  const theme = useLifeStore((s) => s.theme);
  const setTheme = useLifeStore((s) => s.setTheme);
  const exportJson = useLifeStore((s) => s.exportJson);

  return (
    <aside className="hidden w-72 shrink-0 border-r border-stone-200 bg-app-lightCard p-5 dark:border-stone-800 dark:bg-app-darkCard lg:flex lg:flex-col">
      <Link to="/" className="font-display text-2xl font-bold">
        Life Planner
      </Link>
      <nav className="mt-7 space-y-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-3 py-2 transition-all duration-280 ${
                isActive ? "bg-app-lightAccent/15 text-stone-900 dark:bg-app-darkAccent/20 dark:text-white" : "text-stone-500 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Projects</p>
        <ul className="mt-2 space-y-2">
          {projects.map((project) => (
            <li key={project.id} className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-300">
              <span>{project.icon}</span>
              <span className="max-w-[180px] truncate">{project.name}</span>
            </li>
          ))}
          {projects.length === 0 && <li className="text-sm text-stone-400">Пока нет проектов</li>}
        </ul>
      </div>
      <div className="mt-auto flex flex-col gap-2 pt-10">
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="flex items-center justify-center gap-2 rounded-xl border border-stone-300 px-3 py-2 text-sm transition active:scale-[0.97] dark:border-stone-700"
        >
          {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          {theme === "light" ? "Тёмная тема" : "Светлая тема"}
        </button>
        <button
          onClick={exportJson}
          className="flex items-center justify-center gap-2 rounded-xl border border-stone-300 px-3 py-2 text-sm transition active:scale-[0.97] dark:border-stone-700"
        >
          <Download size={16} />
          Экспорт JSON
        </button>
      </div>
    </aside>
  );
};
