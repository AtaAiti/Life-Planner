import { NavLink } from "react-router-dom";
import { Calendar, CheckSquare, Home, Repeat, Folder } from "lucide-react";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/projects", label: "Projects", icon: Folder },
  { to: "/habits", label: "Habits", icon: Repeat },
  { to: "/calendar", label: "Calendar", icon: Calendar }
] as const;

export const MobileNav = () => (
  <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-stone-200 bg-app-lightCard px-3 py-2 dark:border-stone-800 dark:bg-app-darkCard lg:hidden">
    <ul className="grid grid-cols-4 gap-2">
      {navItems.map(({ to, label, icon: Icon }) => (
        <li key={to}>
          <NavLink
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-xs ${
                isActive ? "bg-app-lightAccent/20 text-stone-900 dark:bg-app-darkAccent/20 dark:text-white" : "text-stone-500 dark:text-stone-300"
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        </li>
      ))}
    </ul>
  </nav>
);
