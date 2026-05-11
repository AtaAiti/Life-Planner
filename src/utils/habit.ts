import { format, parseISO, startOfWeek, subWeeks } from "date-fns";
import type { Habit } from "@/types";

export const computeHabitStreak = (habit: Habit): number => {
  if (habit.completedDates.length === 0) {
    return 0;
  }
  const doneSet = new Set(habit.completedDates);
  let streak = 0;
  let cursorWeek = startOfWeek(new Date(), { weekStartsOn: 1 });

  while (true) {
    const weekKey = format(cursorWeek, "yyyy-'W'II");
    let weekCount = 0;
    for (const date of doneSet) {
      const dateObj = parseISO(date);
      if (format(startOfWeek(dateObj, { weekStartsOn: 1 }), "yyyy-'W'II") === weekKey) {
        weekCount += 1;
      }
    }
    if (weekCount >= habit.targetPerWeek) {
      streak += 1;
      cursorWeek = subWeeks(cursorWeek, 1);
    } else {
      break;
    }
  }
  return streak;
};

export const completionPercent = (habit: Habit): number => {
  const last4Weeks = new Set<string>();
  for (let i = 0; i < 4; i += 1) {
    last4Weeks.add(format(subWeeks(startOfWeek(new Date(), { weekStartsOn: 1 }), i), "yyyy-'W'II"));
  }
  const hits = habit.completedDates.filter((d) => last4Weeks.has(format(startOfWeek(parseISO(d), { weekStartsOn: 1 }), "yyyy-'W'II"))).length;
  const max = habit.targetPerWeek * 4;
  return max ? Math.min(100, Math.round((hits / max) * 100)) : 0;
};

export const bestStreak = (habits: Habit[]): number => {
  if (habits.length === 0) {
    return 0;
  }
  return Math.max(...habits.map((h) => h.streak));
};
