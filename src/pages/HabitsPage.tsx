import { format, parseISO, subDays } from "date-fns";
import { useMemo, type FormEvent } from "react";
import { Card } from "@/components/shared/Card";
import { EmptyState } from "@/components/shared/EmptyState";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { useLifeStore } from "@/store/useLifeStore";
import { completionPercent } from "@/utils/habit";
import { toISODate } from "@/utils/date";

const milestone = (streak: number): string | null => {
  const milestones = [100, 60, 30, 14, 7];
  const found = milestones.find((m) => streak === m);
  return found ? `🔥 Amazing! Streak ${found} weeks` : null;
};

export const HabitsPage = () => {
  const habits = useLifeStore((s) => s.habits);
  const addHabit = useLifeStore((s) => s.addHabit);
  const removeHabit = useLifeStore((s) => s.removeHabit);
  const toggleHabitDoneToday = useLifeStore((s) => s.toggleHabitDoneToday);
  const toggleHabitArchive = useLifeStore((s) => s.toggleHabitArchive);
  const today = toISODate(new Date());

  const activeHabits = useMemo(() => habits.filter((habit) => !habit.archived), [habits]);
  const archivedHabits = useMemo(() => habits.filter((habit) => habit.archived), [habits]);
  const overall = useMemo(
    () =>
      activeHabits.length
        ? Math.round(activeHabits.reduce((acc, habit) => acc + completionPercent(habit), 0) / activeHabits.length)
        : 0,
    [activeHabits]
  );
  const avgPerWeek = useMemo(
    () =>
      activeHabits.length
        ? Math.round(
            activeHabits.reduce(
              (acc, habit) =>
                acc +
                habit.completedDates.filter((date) => {
                  const diffDays = Math.floor((Date.now() - parseISO(date).getTime()) / (1000 * 60 * 60 * 24));
                  return diffDays >= 0 && diffDays <= 28;
                }).length /
                  4,
              0
            ) / activeHabits.length
          )
        : 0,
    [activeHabits]
  );

  const onAdd = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    addHabit({
      title: String(data.get("title") ?? ""),
      icon: String(data.get("icon") ?? "✨"),
      color: String(data.get("color") ?? "#F59E0B"),
      targetPerWeek: Number(data.get("targetPerWeek") ?? 7)
    });
    event.currentTarget.reset();
  };

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl font-bold">Habits</h1>
      <div className="grid gap-3 md:grid-cols-3">
        <Card>
          <p className="text-sm text-stone-500">General percent</p>
          <p className="text-2xl font-semibold">{overall}%</p>
        </Card>
        <Card>
          <p className="text-sm text-stone-500">The best streak</p>
          <p className="text-2xl font-semibold">{Math.max(0, ...activeHabits.map((h) => h.streak))}</p>
        </Card>
        <Card>
          <p className="text-sm text-stone-500">Average in the week</p>
          <p className="text-2xl font-semibold">{avgPerWeek}</p>
        </Card>
      </div>
      <Card>
        <form onSubmit={onAdd} className="grid gap-2 md:grid-cols-4">
          <input
            name="title"
            placeholder="New habit"
            className="rounded-xl border border-stone-300 bg-transparent px-3 py-2 dark:border-stone-700"
          />
          <input name="icon" defaultValue="✨" className="rounded-xl border border-stone-300 bg-transparent px-3 py-2 dark:border-stone-700" />
          <input name="color" type="color" defaultValue="#F59E0B" className="h-11 rounded-xl border border-stone-300 bg-transparent px-2 py-1 dark:border-stone-700" />
          <div className="flex gap-2">
            <input
              name="targetPerWeek"
              type="number"
              min={1}
              max={7}
              defaultValue={7}
              className="w-full rounded-xl border border-stone-300 bg-transparent px-3 py-2 dark:border-stone-700"
            />
            <button className="rounded-xl bg-app-lightAccent px-4 py-2 font-medium text-stone-900 active:scale-[0.97] dark:bg-app-darkAccent">
              Add
            </button>
          </div>
        </form>
      </Card>
      {activeHabits.length === 0 ? (
        <EmptyState title="No habits yet" subtitle="Add a new habit and mark it every day." />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {activeHabits.map((habit) => {
            const msg = milestone(habit.streak);
            return (
              <Card key={habit.id} className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-semibold">
                      {habit.icon} {habit.title}
                    </h2>
                    <p className="text-sm text-stone-500">
                      Goal: {habit.targetPerWeek} / week · streak: {habit.streak}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleHabitDoneToday(habit.id)}
                    className="rounded-xl border border-stone-300 px-3 py-2 text-sm active:scale-[0.97] dark:border-stone-700"
                    style={{ borderColor: habit.color }}
                  >
                    {habit.completedDates.includes(today) ? "Remove" : "Mark"}
                  </button>
                </div>
                <ProgressBar value={completionPercent(habit)} />
                {msg && <p className="text-sm font-medium text-amber-600 dark:text-amber-400">{msg}</p>}
                <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(14, minmax(0, 1fr))" }}>
                  {Array.from({ length: 28 }, (_, i) => {
                    const date = toISODate(subDays(new Date(), 27 - i));
                    const done = habit.completedDates.includes(date);
                    return (
                      <div
                        key={date}
                        title={`${format(parseISO(date), "dd.MM")}: ${done ? "done" : "miss"}`}
                        className="aspect-square rounded-[6px] border border-stone-200 dark:border-stone-700"
                        style={{ background: done ? habit.color : "transparent" }}
                      />
                    );
                  })}
                </div>
                <div className="flex gap-2 text-sm">
                  <button onClick={() => toggleHabitArchive(habit.id)} className="rounded-lg border border-stone-300 px-2 py-1 dark:border-stone-700">
                    To archive
                  </button>
                  <button onClick={() => removeHabit(habit.id)} className="rounded-lg border border-red-300 px-2 py-1 text-red-600 dark:border-red-600/40">
                    Remove
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
      {archivedHabits.length > 0 && (
        <Card className="space-y-2">
          <h2 className="font-display text-xl font-semibold">Archive</h2>
          {archivedHabits.map((habit) => (
            <div key={habit.id} className="flex items-center justify-between rounded-xl border border-stone-300 px-3 py-2 dark:border-stone-700">
              <span className="truncate">
                {habit.icon} {habit.title}
              </span>
              <button onClick={() => toggleHabitArchive(habit.id)} className="text-sm underline">
                Recover
              </button>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
};
