import type { LifeData } from "@/types";

const STORAGE_KEY = "life-planner-data-v1";

export const defaultData: LifeData = {
  tasks: [],
  habits: [],
  projects: [],
  theme: "light"
};

export const loadLifeData = (): { data: LifeData; recovered: boolean } => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { data: defaultData, recovered: false };
    }
    const parsed = JSON.parse(raw) as Partial<LifeData>;
    if (!parsed || !Array.isArray(parsed.tasks) || !Array.isArray(parsed.habits) || !Array.isArray(parsed.projects)) {
      throw new Error("Invalid shape");
    }
    return {
      data: {
        tasks: parsed.tasks,
        habits: parsed.habits,
        projects: parsed.projects,
        theme: parsed.theme === "dark" ? "dark" : "light"
      },
      recovered: false
    };
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return { data: defaultData, recovered: true };
  }
};

export const saveLifeData = (data: LifeData): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};
