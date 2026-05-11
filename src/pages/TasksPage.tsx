import { useMemo, useState, type FormEvent } from "react";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/shared/Badge";
import { Card } from "@/components/shared/Card";
import { EmptyState } from "@/components/shared/EmptyState";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { selectTaskProject, taskMatchesFilter, useLifeStore } from "@/store/useLifeStore";
import type { Priority, RecurringType, Task } from "@/types";
import { isOverdue } from "@/utils/date";

const priorityEmoji: Record<Priority, string> = {
  1: "🔴",
  2: "🟠",
  3: "🟡",
  4: "⚪"
};

const groupKey = (task: Task): string => {
  if (!task.dueDate) {
    return "Inbox";
  }
  return task.dueDate;
};

export const TasksPage = () => {
  const tasks = useLifeStore((s) => s.tasks);
  const projects = useLifeStore((s) => s.projects);
  const taskFilter = useLifeStore((s) => s.taskFilter);
  const taskSearch = useLifeStore((s) => s.taskSearch);
  const taskGroupBy = useLifeStore((s) => s.taskGroupBy);
  const setTaskFilter = useLifeStore((s) => s.setTaskFilter);
  const setTaskSearch = useLifeStore((s) => s.setTaskSearch);
  const setTaskGroupBy = useLifeStore((s) => s.setTaskGroupBy);
  const addTask = useLifeStore((s) => s.addTask);
  const updateTask = useLifeStore((s) => s.updateTask);
  const toggleTask = useLifeStore((s) => s.toggleTask);
  const removeTask = useLifeStore((s) => s.removeTask);
  const reorderTasks = useLifeStore((s) => s.reorderTasks);
  const addSubtask = useLifeStore((s) => s.addSubtask);
  const toggleSubtask = useLifeStore((s) => s.toggleSubtask);
  const removeSubtask = useLifeStore((s) => s.removeSubtask);
  const addProject = useLifeStore((s) => s.addProject);
  const renameProject = useLifeStore((s) => s.renameProject);
  const removeProject = useLifeStore((s) => s.removeProject);
  const [dragId, setDragId] = useState<string | null>(null);
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [newSubtaskTaskId, setNewSubtaskTaskId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return tasks
      .filter((task) => taskMatchesFilter(task, taskFilter))
      .filter((task) => task.title.toLowerCase().includes(taskSearch.toLowerCase()))
      .sort((a, b) => a.order - b.order);
  }, [tasks, taskFilter, taskSearch]);

  const grouped = useMemo(() => {
    if (taskGroupBy === "none") {
      return { All: filtered };
    }
    if (taskGroupBy === "priority") {
      return filtered.reduce<Record<string, Task[]>>((acc, task) => {
        const key = `Priority ${task.priority}`;
        acc[key] = [...(acc[key] ?? []), task];
        return acc;
      }, {});
    }
    if (taskGroupBy === "project") {
      return filtered.reduce<Record<string, Task[]>>((acc, task) => {
        const project = selectTaskProject(task, projects);
        const key = project ? `${project.icon} ${project.name}` : "Inbox";
        acc[key] = [...(acc[key] ?? []), task];
        return acc;
      }, {});
    }
    return filtered.reduce<Record<string, Task[]>>((acc, task) => {
      const key = groupKey(task);
      acc[key] = [...(acc[key] ?? []), task];
      return acc;
    }, {});
  }, [filtered, taskGroupBy, projects]);

  const onCreateTask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    const recurringType = String(fd.get("recurringType") || "");
    addTask({
      title: String(fd.get("title") || ""),
      dueDate: String(fd.get("dueDate") || "") || null,
      dueTime: String(fd.get("dueTime") || "") || null,
      projectId: String(fd.get("projectId") || "") || null,
      priority: Number(fd.get("priority") || 4) as Priority,
      labels: String(fd.get("labels") || "")
        .split(",")
        .map((label) => label.trim())
        .filter(Boolean),
      recurring:
        recurringType === "daily" || recurringType === "weekly" || recurringType === "monthly"
          ? {
              type: recurringType as RecurringType,
              interval: Number(fd.get("recurringInterval") || 1)
            }
          : null
    });
    event.currentTarget.reset();
  };

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl font-bold">Tasks</h1>
      <Card className="space-y-3">
        <form onSubmit={onCreateTask} className="grid gap-2 md:grid-cols-4">
          <input name="title" placeholder="New task" className="rounded-xl border border-stone-300 bg-transparent px-3 py-2 dark:border-stone-700" />
          <input type="date" name="dueDate" className="rounded-xl border border-stone-300 bg-transparent px-3 py-2 dark:border-stone-700" />
          <select name="priority" defaultValue="4" className="rounded-xl border border-stone-300 bg-transparent px-3 py-2 dark:border-stone-700">
            <option value="1">Priority 1</option>
            <option value="2">Priority 2</option>
            <option value="3">Priority 3</option>
            <option value="4">Priority 4</option>
          </select>
          <button className="rounded-xl bg-app-lightAccent px-4 py-2 font-medium text-stone-900 active:scale-[0.97] dark:bg-app-darkAccent">Add</button>
          <input type="time" name="dueTime" className="rounded-xl border border-stone-300 bg-transparent px-3 py-2 dark:border-stone-700" />
          <select name="projectId" defaultValue="" className="rounded-xl border border-stone-300 bg-transparent px-3 py-2 dark:border-stone-700">
            <option value="">Inbox</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.icon} {project.name}
              </option>
            ))}
          </select>
          <input name="labels" placeholder="labels separated by comma" className="rounded-xl border border-stone-300 bg-transparent px-3 py-2 dark:border-stone-700" />
          <div className="grid grid-cols-2 gap-2">
            <select name="recurringType" defaultValue="" className="rounded-xl border border-stone-300 bg-transparent px-3 py-2 dark:border-stone-700">
              <option value="">No repeat</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <input
              name="recurringInterval"
              type="number"
              defaultValue={1}
              min={1}
              className="rounded-xl border border-stone-300 bg-transparent px-3 py-2 dark:border-stone-700"
            />
          </div>
        </form>
      </Card>

      <Card className="space-y-3">
        <div className="grid gap-2 md:grid-cols-4">
          <input
            value={taskSearch}
            onChange={(e) => setTaskSearch(e.target.value)}
            placeholder="Search task"
            className="rounded-xl border border-stone-300 bg-transparent px-3 py-2 dark:border-stone-700"
          />
          <select value={taskFilter} onChange={(e) => setTaskFilter(e.target.value as typeof taskFilter)} className="rounded-xl border border-stone-300 bg-transparent px-3 py-2 dark:border-stone-700">
            <option value="today">Today</option>
            <option value="week">This week</option>
            <option value="all">All active</option>
            <option value="completed">Completed</option>
          </select>
          <select value={taskGroupBy} onChange={(e) => setTaskGroupBy(e.target.value as typeof taskGroupBy)} className="rounded-xl border border-stone-300 bg-transparent px-3 py-2 dark:border-stone-700">
            <option value="none">No grouping</option>
            <option value="project">By project</option>
            <option value="date">By date</option>
            <option value="priority">By priority</option>
          </select>
          <button
            onClick={() => addProject({ name: "New Project", icon: "📁", color: "#3B82F6" })}
            className="rounded-xl border border-stone-300 px-3 py-2 text-sm active:scale-[0.97] dark:border-stone-700"
          >
            + Project
          </button>
        </div>
        {projects.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {projects.map((project) => (
              <div key={project.id} className="flex items-center gap-2 rounded-full border border-stone-300 px-3 py-1 text-sm dark:border-stone-700">
                <span>{project.icon}</span>
                <button className="max-w-28 truncate" onClick={() => {
                  const next = prompt("Project name", project.name);
                  if (next) {
                    renameProject(project.id, next);
                  }
                }}>
                  {project.name}
                </button>
                <button className="text-red-500" onClick={() => removeProject(project.id)}>
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="space-y-4">
        {Object.entries(grouped).map(([group, list]) => (
          <Card key={group} className="space-y-3 fade-in">
            <h2 className="font-display text-xl font-semibold">{group}</h2>
            {list.length === 0 && <EmptyState title="List is empty" subtitle="Add your first task." />}
            <ul className="space-y-2">
              {list.map((task) => {
                const doneSubtasks = task.subtasks.filter((s) => s.completed).length;
                const subtaskProgress = task.subtasks.length ? Math.round((doneSubtasks / task.subtasks.length) * 100) : 0;
                const project = selectTaskProject(task, projects);
                return (
                  <li
                    key={task.id}
                    draggable
                    onDragStart={() => setDragId(task.id)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (dragId && dragId !== task.id) {
                        reorderTasks(dragId, task.id);
                      }
                      setDragId(null);
                    }}
                    className={`rounded-xl border px-3 py-3 transition hover:-translate-y-[1px] hover:shadow-soft dark:border-stone-700 ${
                      isOverdue(task.dueDate) && !task.completed ? "border-red-400/70 bg-red-50/60 dark:bg-red-950/20" : "border-stone-200"
                    }`}
                    style={{ borderLeftWidth: 6, borderLeftColor: project?.color ?? "#9CA3AF" }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-2 flex-1">
                            <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id)} />
                            <span className="max-w-[340px] truncate font-medium">{task.title}</span>
                          </label>
                          {task.subtasks.length > 0 && (
                            <button
                              onClick={() => {
                                const next = new Set(expandedTasks);
                                if (next.has(task.id)) {
                                  next.delete(task.id);
                                } else {
                                  next.add(task.id);
                                }
                                setExpandedTasks(next);
                              }}
                              className="shrink-0 p-1 hover:bg-stone-100 dark:hover:bg-stone-800 rounded"
                            >
                              <ChevronDown size={16} className={`transition ${expandedTasks.has(task.id) ? "rotate-180" : ""}`} />
                            </button>
                          )}
                        </div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          <Badge text={`${priorityEmoji[task.priority]} P${task.priority}`} />
                          <Badge text={task.dueDate ? `${task.dueDate}${task.dueTime ? ` ${task.dueTime}` : ""}` : "Inbox"} />
                          {task.labels.map((label) => (
                            <Badge key={label} text={`#${label}`} />
                          ))}
                          {task.recurring && <Badge text={`Repeat: ${task.recurring.type}/${task.recurring.interval}`} />}
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          className="text-sm text-stone-500"
                          onClick={() => {
                            const next = prompt("New title", task.title);
                            if (next) {
                              updateTask(task.id, { title: next.trim() });
                            }
                          }}
                        >
                          ✎
                        </button>
                        <button className="text-sm text-red-500" onClick={() => removeTask(task.id)}>
                          🗑
                        </button>
                      </div>
                    </div>
                    <div className={`mt-2 space-y-1 overflow-hidden transition-all duration-280 ${expandedTasks.has(task.id) ? "max-h-96" : "max-h-0"}`}>
                      {task.subtasks.length > 0 && <ProgressBar value={subtaskProgress} />}
                      {task.subtasks.map((subtask) => (
                        <div key={subtask.id} className="flex items-center gap-2 text-sm text-stone-500">
                          <label className="flex items-center gap-2 flex-1 min-w-0">
                            <input type="checkbox" checked={subtask.completed} onChange={() => toggleSubtask(task.id, subtask.id)} />
                            <span className="truncate">{subtask.title}</span>
                          </label>
                          <button
                            onClick={() => removeSubtask(task.id, subtask.id)}
                            className="shrink-0 text-xs text-red-500 hover:text-red-600"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      {newSubtaskTaskId === task.id ? (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            const input = (e.currentTarget.elements[0] as HTMLInputElement);
                            const title = input.value.trim();
                            if (title) {
                              addSubtask(task.id, title);
                              setNewSubtaskTaskId(null);
                            }
                          }}
                          className="flex gap-2"
                        >
                          <input
                            type="text"
                            placeholder="Новая подзадача"
                            autoFocus
                            className="flex-1 text-sm rounded-lg border border-stone-300 bg-transparent px-2 py-1 dark:border-stone-700 outline-none focus:border-app-lightAccent dark:focus:border-app-darkAccent"
                          />
                          <button
                            type="submit"
                            className="shrink-0 text-xs font-medium text-app-lightAccent dark:text-app-darkAccent"
                          >
                            ✓
                          </button>
                          <button
                            type="button"
                            onClick={() => setNewSubtaskTaskId(null)}
                            className="shrink-0 text-xs text-stone-400"
                          >
                            ✕
                          </button>
                        </form>
                      ) : (
                        <button
                          onClick={() => setNewSubtaskTaskId(task.id)}
                          className="text-xs text-app-lightAccent dark:text-app-darkAccent hover:underline"
                        >
                          + Подзадача
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
};
