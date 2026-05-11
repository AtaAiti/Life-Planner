export type Priority = 1 | 2 | 3 | 4;
export type RecurringType = "daily" | "weekly" | "monthly";
export type CalendarView = "day" | "week" | "month";
export type ThemeMode = "light" | "dark";
export type TaskFilter = "today" | "week" | "all" | "completed";
export type TaskGroupBy = "none" | "project" | "date" | "priority";

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface RecurringRule {
  type: RecurringType;
  interval: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string | null;
  priority: Priority;
  dueDate: string | null;
  dueTime: string | null;
  completed: boolean;
  completedAt: string | null;
  order: number;
  subtasks: Subtask[];
  labels: string[];
  recurring: RecurringRule | null;
  createdAt: string;
}

export interface Habit {
  id: string;
  title: string;
  color: string;
  icon: string;
  targetPerWeek: number;
  completedDates: string[];
  streak: number;
  archived: boolean;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  icon: string;
  createdAt: string;
}

export interface LifeData {
  tasks: Task[];
  habits: Habit[];
  projects: Project[];
  theme: ThemeMode;
}
