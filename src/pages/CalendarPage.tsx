import { addDays, addMonths, format, parseISO, subMonths } from "date-fns";
import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { Card } from "@/components/shared/Card";
import { EmptyState } from "@/components/shared/EmptyState";
import { useLifeStore } from "@/store/useLifeStore";
import { isOverdue, monthGridDates, weekDates } from "@/utils/date";

export const CalendarPage = () => {
  const tasks = useLifeStore((s) => s.tasks);
  const allHabits = useLifeStore((s) => s.habits);
  const calendarView = useLifeStore((s) => s.calendarView);
  const selectedDate = useLifeStore((s) => s.selectedDate);
  const setCalendarView = useLifeStore((s) => s.setCalendarView);
  const setSelectedDate = useLifeStore((s) => s.setSelectedDate);
  const moveTaskToDate = useLifeStore((s) => s.moveTaskToDate);
  const addTask = useLifeStore((s) => s.addTask);
  const updateTask = useLifeStore((s) => s.updateTask);
  const removeTask = useLifeStore((s) => s.removeTask);
  const toggleTask = useLifeStore((s) => s.toggleTask);
  const [dragTaskId, setDragTaskId] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const habits = useMemo(() => allHabits.filter((h) => !h.archived), [allHabits]);
  const editingTask = useMemo(() => tasks.find((t) => t.id === editingTaskId), [tasks, editingTaskId]);

  const dateObj = parseISO(selectedDate);
  const cells = useMemo(() => {
    if (calendarView === "day") {
      return [selectedDate];
    }
    if (calendarView === "week") {
      return weekDates(dateObj);
    }
    return monthGridDates(dateObj);
  }, [calendarView, dateObj, selectedDate]);

  const headerDate =
    calendarView === "day"
      ? format(dateObj, "d MMMM yyyy")
      : calendarView === "week"
        ? `${format(parseISO(cells[0]), "d MMM")} - ${format(parseISO(cells[6]), "d MMM")}`
        : format(dateObj, "LLLL yyyy");

  const shift = (step: number) => {
    const base = parseISO(selectedDate);
    if (calendarView === "day") {
      setSelectedDate(format(addDays(base, step), "yyyy-MM-dd"));
      return;
    }
    if (calendarView === "week") {
      setSelectedDate(format(addDays(base, step * 7), "yyyy-MM-dd"));
      return;
    }
    setSelectedDate(format(step > 0 ? addMonths(base, 1) : subMonths(base, 1), "yyyy-MM-dd"));
  };

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl font-bold">Calendar</h1>
      <Card className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button onClick={() => shift(-1)} className="rounded-xl border border-stone-300 px-3 py-2 active:scale-[0.97] dark:border-stone-700">
            ←
          </button>
          <button onClick={() => setSelectedDate(format(new Date(), "yyyy-MM-dd"))} className="rounded-xl border border-stone-300 px-3 py-2 active:scale-[0.97] dark:border-stone-700">
            Today
          </button>
          <button onClick={() => shift(1)} className="rounded-xl border border-stone-300 px-3 py-2 active:scale-[0.97] dark:border-stone-700">
            →
          </button>
        </div>
        <h2 className="font-display text-xl font-semibold">{headerDate}</h2>
        <div className="flex gap-2">
          {(["day", "week", "month"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setCalendarView(mode)}
              className={`rounded-xl px-3 py-2 text-sm ${calendarView === mode ? "bg-app-lightAccent/20 dark:bg-app-darkAccent/20" : "border border-stone-300 dark:border-stone-700"}`}
            >
              {mode === "day" ? "Day" : mode === "week" ? "Week" : "Month"}
            </button>
          ))}
        </div>
      </Card>

      <div className={`grid gap-2 ${calendarView === "month" ? "grid-cols-7" : calendarView === "week" ? "grid-cols-1 md:grid-cols-7" : "grid-cols-1"}`}>
        {cells.map((date) => {
          const dayTasks = tasks.filter((task) => task.dueDate === date);
          const dayHabits = habits.filter((habit) => habit.completedDates.includes(date));
          const isToday = date === format(new Date(), "yyyy-MM-dd");
          return (
            <div
              key={date}
              onDragOver={(e: React.DragEvent<HTMLDivElement>) => e.preventDefault()}
              onDrop={() => {
                if (dragTaskId) {
                  moveTaskToDate(dragTaskId, date);
                  setDragTaskId(null);
                }
              }}
            >
              <Card
                className={`min-h-32 space-y-2 p-3 ${isToday ? "ring-2 ring-app-lightAccent/50 dark:ring-app-darkAccent/50" : ""}`}
              >
              <div className="flex items-center justify-between">
                <button onClick={() => setSelectedDate(date)} className="text-left text-sm font-medium">
                  {format(parseISO(date), "d MMM")}
                </button>
                <button
                  onClick={() => addTask({ title: `New task ${date}`, dueDate: date })}
                  className="rounded-lg border border-stone-300 px-2 py-1 text-xs dark:border-stone-700"
                >
                  +
                </button>
              </div>
              <div className="space-y-1">
                {dayTasks.slice(0, 4).map((task) => (
                  <button
                    key={task.id}
                    draggable
                    onDragStart={() => setDragTaskId(task.id)}
                    onClick={() => setEditingTaskId(task.id)}
                    className={`w-full truncate rounded-lg px-2 py-1 text-xs text-left transition active:scale-[0.97] ${
                      isOverdue(task.dueDate) && !task.completed ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" : "bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700"
                    }`}
                    title={task.title}
                  >
                    {task.completed ? "✅ " : ""}
                    {task.title}
                  </button>
                ))}
                {dayTasks.length === 0 && <EmptyState title="No tasks" subtitle="Empty day." />}
              </div>
              <div className="flex flex-wrap gap-1">
                {dayHabits.map((habit) => (
                  <span key={habit.id} className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: habit.color }} />
                ))}
              </div>
            </Card>
            </div>
          );
        })}
      </div>
      {calendarView === "day" && (
        <Card className="space-y-2">
          <h3 className="font-medium">Daily Schedule</h3>
          <div className="grid gap-1">
            {Array.from({ length: 24 }, (_, hour) => {
              const currentHour = new Date().getHours();
              const active = currentHour === hour && selectedDate === format(new Date(), "yyyy-MM-dd");
              return (
                <div
                  key={hour}
                  className={`rounded-lg px-3 py-1 text-sm ${active ? "bg-app-lightAccent/20 font-medium dark:bg-app-darkAccent/20" : "bg-stone-100 dark:bg-stone-800"}`}
                >
                  {String(hour).padStart(2, "0")}:00
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/50 sm:items-center sm:justify-center">
          <Card className="w-full max-w-md space-y-4 rounded-t-3xl p-6 sm:rounded-3xl">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">Edit Task</h2>
              <button
                onClick={() => setEditingTaskId(null)}
                className="rounded-lg p-1 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                <X size={20} />
              </button>
            </div>

            <input
              type="text"
              value={editingTask.title}
              onChange={(e) => updateTask(editingTask.id, { title: e.target.value })}
              className="w-full rounded-xl border border-stone-300 bg-transparent px-3 py-2 outline-none focus:border-app-lightAccent dark:border-stone-700 dark:focus:border-app-darkAccent"
              placeholder="Name of task"
            />

            <div className="space-y-2">
              <p className="text-sm text-stone-500">Status</p>
              <button
                onClick={() => toggleTask(editingTask.id)}
                className={`w-full rounded-xl px-4 py-2 font-medium transition active:scale-[0.97] ${
                  editingTask.completed
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                    : "border border-stone-300 dark:border-stone-700"
                }`}
              >
                {editingTask.completed ? "✅ Completed" : "Mark as completed"}
              </button>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={() => {
                  removeTask(editingTask.id);
                  setEditingTaskId(null);
                }}
                className="flex-1 rounded-xl border border-red-300 px-4 py-2 font-medium text-red-600 transition active:scale-[0.97] dark:border-red-600/40"
              >
                Delete
              </button>
              <button
                onClick={() => setEditingTaskId(null)}
                className="flex-1 rounded-xl bg-app-lightAccent px-4 py-2 font-medium text-stone-900 transition active:scale-[0.97] dark:bg-app-darkAccent"
              >
                Done
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
