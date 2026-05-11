import { create } from "zustand";
import type { CalendarView, Habit, LifeData, Priority, Project, Task, TaskFilter, TaskGroupBy, ThemeMode } from "@/types";
import { computeHabitStreak } from "@/utils/habit";
import { loadLifeData } from "@/utils/storage";
import { isDateThisWeek, isDateToday, shiftRecurringDate, toISODate } from "@/utils/date";

const { data: bootData, recovered } = loadLifeData();

interface TaskInput {
  title: string;
  description?: string;
  projectId?: string | null;
  priority?: Priority;
  dueDate?: string | null;
  dueTime?: string | null;
  labels?: string[];
  recurring?: Task["recurring"];
}

interface HabitInput {
  title: string;
  color: string;
  icon: string;
  targetPerWeek: number;
}

interface ProjectInput {
  name: string;
  color: string;
  icon: string;
}

interface LifeState extends LifeData {
  selectedDate: string;
  calendarView: CalendarView;
  taskFilter: TaskFilter;
  taskGroupBy: TaskGroupBy;
  taskSearch: string;
  notification: string | null;
  addTask: (payload: TaskInput) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  removeTask: (id: string) => void;
  toggleTask: (id: string) => void;
  reorderTasks: (fromId: string, toId: string) => void;
  moveTaskToDate: (id: string, date: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  removeSubtask: (taskId: string, subtaskId: string) => void;
  addProject: (payload: ProjectInput) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  renameProject: (id: string, name: string) => void;
  removeProject: (id: string) => void;
  addHabit: (payload: HabitInput) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  removeHabit: (id: string) => void;
  toggleHabitDoneToday: (id: string) => void;
  toggleHabitArchive: (id: string) => void;
  setTheme: (theme: ThemeMode) => void;
  setTaskFilter: (filter: TaskFilter) => void;
  setTaskGroupBy: (groupBy: TaskGroupBy) => void;
  setTaskSearch: (value: string) => void;
  setCalendarView: (view: CalendarView) => void;
  setSelectedDate: (date: string) => void;
  dismissNotification: () => void;
  recomputeHabitStreaks: () => void;
  exportJson: () => void;
}

const id = (): string => crypto.randomUUID();

const normalize = <T extends { order: number }>(items: T[]): T[] =>
  items
    .sort((a, b) => a.order - b.order)
    .map((item, index) => ({ ...item, order: index }));

export const useLifeStore = create<LifeState>((set, get) => ({
  ...bootData,
  selectedDate: toISODate(new Date()),
  calendarView: "week",
  taskFilter: "all",
  taskGroupBy: "none",
  taskSearch: "",
  notification: recovered ? "Data in localStorage was corrupted and reset to default." : null,

  addTask: (payload) =>
    set((state) => {
      const title = payload.title.trim();
      if (!title) {
        return { notification: "Task title is required." };
      }
      const task: Task = {
        id: id(),
        title,
        description: payload.description?.trim() ?? "",
        projectId: payload.projectId ?? null,
        priority: payload.priority ?? 4,
        dueDate: payload.dueDate ?? null,
        dueTime: payload.dueTime ?? null,
        completed: false,
        completedAt: null,
        subtasks: [],
        labels: (payload.labels ?? []).map((l) => l.trim()).filter(Boolean),
        recurring: payload.recurring ?? null,
        order: state.tasks.length,
        createdAt: toISODate(new Date())
      };
      return { tasks: [...state.tasks, task] };
    }),

  updateTask: (taskId, updates) =>
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task))
    })),

  removeTask: (taskId) =>
    set((state) => ({
      tasks: normalize(state.tasks.filter((task) => task.id !== taskId))
    })),

  toggleTask: (taskId) =>
    set((state) => {
      const today = toISODate(new Date());
      const updatedTasks: Task[] = [];
      for (const task of state.tasks) {
        if (task.id !== taskId) {
          updatedTasks.push(task);
          continue;
        }
        const nextCompleted = !task.completed;
        const nextTask: Task = {
          ...task,
          completed: nextCompleted,
          completedAt: nextCompleted ? today : null
        };
        updatedTasks.push(nextTask);
        if (nextCompleted && task.recurring && task.dueDate) {
          updatedTasks.push({
            ...task,
            id: id(),
            completed: false,
            completedAt: null,
            dueDate: shiftRecurringDate(task.dueDate, task.recurring),
            order: state.tasks.length + 1,
            createdAt: today
          });
        }
      }
      return { tasks: normalize(updatedTasks) };
    }),

  reorderTasks: (fromId, toId) =>
    set((state) => {
      const tasks = [...state.tasks].sort((a, b) => a.order - b.order);
      const from = tasks.findIndex((t) => t.id === fromId);
      const to = tasks.findIndex((t) => t.id === toId);
      if (from < 0 || to < 0) {
        return {};
      }
      const [moved] = tasks.splice(from, 1);
      tasks.splice(to, 0, moved);
      return { tasks: normalize(tasks) };
    }),

  moveTaskToDate: (taskId, date) =>
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === taskId ? { ...task, dueDate: date } : task))
    })),

  addSubtask: (taskId, title) =>
    set((state) => {
      const trimmed = title.trim();
      if (!trimmed) {
        return {};
      }
      return {
        tasks: state.tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                subtasks: [...task.subtasks, { id: id(), title: trimmed, completed: false }]
              }
            : task
        )
      };
    }),

  toggleSubtask: (taskId, subtaskId) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.map((subtask) =>
                subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
              )
            }
          : task
      )
    })),

  removeSubtask: (taskId, subtaskId) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.filter((subtask) => subtask.id !== subtaskId)
            }
          : task
      )
    })),

  addProject: (payload) =>
    set((state) => ({
      projects: [
        ...state.projects,
        {
          id: id(),
          name: payload.name.trim() || "New Project",
          color: payload.color,
          icon: payload.icon,
          createdAt: toISODate(new Date())
        }
      ]
    })),

  updateProject: (projectId, updates) =>
    set((state) => ({
      projects: state.projects.map((project) => (project.id === projectId ? { ...project, ...updates } : project))
    })),

  renameProject: (projectId, name) =>
    set((state) => {
      const trimmed = name.trim();
      if (!trimmed) {
        return {};
      }
      return {
        projects: state.projects.map((project) => (project.id === projectId ? { ...project, name: trimmed } : project))
      };
    }),

  removeProject: (projectId) =>
    set((state) => ({
      projects: state.projects.filter((project) => project.id !== projectId),
      tasks: state.tasks.map((task) => (task.projectId === projectId ? { ...task, projectId: null } : task))
    })),

  addHabit: (payload) =>
    set((state) => {
      const title = payload.title.trim();
      if (!title) {
        return { notification: "Habit title is required." };
      }
      const habit: Habit = {
        id: id(),
        title,
        color: payload.color,
        icon: payload.icon,
        targetPerWeek: Math.max(1, Math.min(7, payload.targetPerWeek)),
        completedDates: [],
        streak: 0,
        archived: false,
        createdAt: toISODate(new Date())
      };
      return { habits: [...state.habits, habit] };
    }),

  updateHabit: (habitId, updates) =>
    set((state) => ({
      habits: state.habits.map((habit) => (habit.id === habitId ? { ...habit, ...updates } : habit))
    })),

  removeHabit: (habitId) =>
    set((state) => ({
      habits: state.habits.filter((habit) => habit.id !== habitId)
    })),

  toggleHabitDoneToday: (habitId) =>
    set((state) => {
      const today = toISODate(new Date());
      const habits = state.habits.map((habit) => {
        if (habit.id !== habitId) {
          return habit;
        }
        const exists = habit.completedDates.includes(today);
        const completedDates = exists
          ? habit.completedDates.filter((date) => date !== today)
          : [...habit.completedDates, today];
        const next = { ...habit, completedDates };
        return { ...next, streak: computeHabitStreak(next) };
      });
      return { habits };
    }),

  toggleHabitArchive: (habitId) =>
    set((state) => ({
      habits: state.habits.map((habit) => (habit.id === habitId ? { ...habit, archived: !habit.archived } : habit))
    })),

  setTheme: (theme) => set({ theme }),
  setTaskFilter: (taskFilter) => set({ taskFilter }),
  setTaskGroupBy: (taskGroupBy) => set({ taskGroupBy }),
  setTaskSearch: (taskSearch) => set({ taskSearch }),
  setCalendarView: (calendarView) => set({ calendarView }),
  setSelectedDate: (selectedDate) => set({ selectedDate }),
  dismissNotification: () => set({ notification: null }),

  recomputeHabitStreaks: () =>
    set((state) => ({
      habits: state.habits.map((habit) => ({ ...habit, streak: computeHabitStreak(habit) }))
    })),

  exportJson: () => {
    const data: LifeData = {
      tasks: get().tasks,
      habits: get().habits,
      projects: get().projects,
      theme: get().theme
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = "life-planner-export.json";
    a.click();
    URL.revokeObjectURL(href);
  }
}));

export const selectTaskProject = (task: Task, projects: Project[]): Project | null =>
  projects.find((project) => project.id === task.projectId) ?? null;

export const taskMatchesFilter = (task: Task, filter: TaskFilter): boolean => {
  if (filter === "completed") {
    return task.completed;
  }
  if (filter === "today") {
    return !task.completed && isDateToday(task.dueDate);
  }
  if (filter === "week") {
    return !task.completed && isDateThisWeek(task.dueDate);
  }
  return filter === "all" ? !task.completed : true;
};
