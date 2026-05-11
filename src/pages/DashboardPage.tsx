import { addDays, format, parseISO } from "date-fns";
import { useMemo, type FormEvent } from "react";
import { Card } from "@/components/shared/Card";
import { EmptyState } from "@/components/shared/EmptyState";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { useLifeStore } from "@/store/useLifeStore";
import { bestStreak } from "@/utils/habit";
import { toISODate } from "@/utils/date";

export const DashboardPage = () => {
  const tasks = useLifeStore((s) => s.tasks);
  const allHabits = useLifeStore((s) => s.habits);
  const addTask = useLifeStore((s) => s.addTask);
  const toggleHabitDoneToday = useLifeStore((s) => s.toggleHabitDoneToday);
  const today = toISODate(new Date());

  const habits = useMemo(() => allHabits.filter((h) => !h.archived), [allHabits]);
  const todayTasks = useMemo(() => tasks.filter((task) => task.dueDate === today), [tasks, today]);
  const completedToday = useMemo(() => todayTasks.filter((task) => task.completed).length, [todayTasks]);
  const dayProgress = useMemo(() => (todayTasks.length ? Math.round((completedToday / todayTasks.length) * 100) : 0), [todayTasks.length, completedToday]);
  const upcoming = useMemo(
    () =>
      tasks
        .filter((task) => task.dueDate && !task.completed)
        .filter((task) => {
          const date = parseISO(task.dueDate!);
          return date >= parseISO(today) && date <= addDays(parseISO(today), 3);
        })
        .sort((a, b) => (a.dueDate ?? "").localeCompare(b.dueDate ?? "")),
    [tasks, today]
  );

  const quickAdd = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") ?? "");
    addTask({ title, dueDate: today, priority: 3 });
    event.currentTarget.reset();
  };

  return (
    <div className="space-y-4">
      <header className="slide-up">
        <h1 className="font-display text-3xl font-bold">Hi! {format(new Date(), "d MMMM, EEEE")}</h1>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-stone-500">Completed today</p>
          <p className="mt-1 text-2xl font-semibold">{completedToday}</p>
        </Card>
        <Card>
          <p className="text-sm text-stone-500">Active habits</p>
          <p className="mt-1 text-2xl font-semibold">{habits.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-stone-500">Best streak</p>
          <p className="mt-1 text-2xl font-semibold">{bestStreak(habits)} weeks</p>
        </Card>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="space-y-3">
          <h2 className="font-display text-xl font-semibold">Today</h2>
          <ProgressBar value={dayProgress} />
          <div className="space-y-2">
            {todayTasks.length === 0 && <EmptyState title="No tasks for today" subtitle="Add a task with quick add below." />}
            {todayTasks.map((task) => (
              <label key={task.id} className="flex items-center gap-2 rounded-xl border border-stone-200 px-3 py-2 dark:border-stone-700">
                <input type="checkbox" checked={task.completed} readOnly />
                <span className="max-w-[260px] truncate">{task.title}</span>
              </label>
            ))}
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Today's habits</p>
            {habits.map((habit) => (
              <button
                key={habit.id}
                onClick={() => toggleHabitDoneToday(habit.id)}
                className="flex w-full items-center justify-between rounded-xl border border-stone-200 px-3 py-2 text-left active:scale-[0.97] dark:border-stone-700"
              >
                <span className="truncate">
                  {habit.icon} {habit.title}
                </span>
                <span>{habit.completedDates.includes(today) ? "✅" : "⬜"}</span>
              </button>
            ))}
          </div>
        </Card>
        <Card className="space-y-3">
          <h2 className="font-display text-xl font-semibold">Upcoming deadlines</h2>
          {upcoming.length === 0 ? (
            <EmptyState title="All clear" subtitle="No deadlines for the next 3 days." />
          ) : (
            <ul className="space-y-2">
              {upcoming.map((task) => (
                <li key={task.id} className="flex items-center justify-between rounded-xl border border-stone-200 px-3 py-2 dark:border-stone-700">
                  <span className="max-w-[260px] truncate">{task.title}</span>
                  <span className="text-sm text-stone-500">{task.dueDate}</span>
                </li>
              ))}
            </ul>
          )}
          <form onSubmit={quickAdd} className="mt-4 flex gap-2">
            <input
              name="title"
              placeholder="Quick add task"
              className="w-full rounded-xl border border-stone-300 bg-transparent px-3 py-2 outline-none focus:border-app-lightAccent dark:border-stone-700 dark:focus:border-app-darkAccent"
            />
            <button className="rounded-xl bg-app-lightAccent px-4 py-2 font-medium text-stone-900 active:scale-[0.97] dark:bg-app-darkAccent">+</button>
          </form>
        </Card>
      </div>
    </div>
  );
};
