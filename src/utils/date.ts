import {
  addDays,
  addMonths,
  addWeeks,
  endOfWeek,
  format,
  isSameDay,
  isToday,
  parseISO,
  startOfWeek
} from "date-fns";
import type { RecurringRule } from "@/types";

export const toISODate = (value: Date) => format(value, "yyyy-MM-dd");

export const parseDate = (value: string | null): Date | null => {
  if (!value) {
    return null;
  }
  const parsed = parseISO(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const isDateToday = (value: string | null): boolean => {
  const parsed = parseDate(value);
  return parsed ? isToday(parsed) : false;
};

export const isDateThisWeek = (value: string | null): boolean => {
  const parsed = parseDate(value);
  if (!parsed) {
    return false;
  }
  const start = startOfWeek(new Date(), { weekStartsOn: 1 });
  const end = endOfWeek(new Date(), { weekStartsOn: 1 });
  return parsed >= start && parsed <= end;
};

export const isOverdue = (value: string | null): boolean => {
  const parsed = parseDate(value);
  if (!parsed) {
    return false;
  }
  const today = parseISO(toISODate(new Date()));
  return parsed < today;
};

export const shiftRecurringDate = (date: string, recurring: RecurringRule): string => {
  const parsed = parseISO(date);
  const next =
    recurring.type === "daily"
      ? addDays(parsed, recurring.interval)
      : recurring.type === "weekly"
        ? addWeeks(parsed, recurring.interval)
        : addMonths(parsed, recurring.interval);
  return toISODate(next);
};

export const weekDates = (base: Date): string[] => {
  const start = startOfWeek(base, { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, index) => toISODate(addDays(start, index)));
};

export const monthGridDates = (base: Date): string[] => {
  const first = new Date(base.getFullYear(), base.getMonth(), 1);
  const start = startOfWeek(first, { weekStartsOn: 1 });
  return Array.from({ length: 42 }, (_, index) => toISODate(addDays(start, index)));
};

export const sameDate = (a: string, b: string): boolean => {
  return isSameDay(parseISO(a), parseISO(b));
};
