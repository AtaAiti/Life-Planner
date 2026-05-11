import { useMemo, useState } from "react";
import { X, Plus, ChevronDown } from "lucide-react";
import { Card } from "@/components/shared/Card";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/shared/Badge";
import { useLifeStore } from "@/store/useLifeStore";
import type { Priority, Task } from "@/types";
import { isOverdue } from "@/utils/date";

const priorityEmoji: Record<Priority, string> = {
  1: "🔴",
  2: "🟠",
  3: "🟡",
  4: "⚪"
};

const EMOJI_LIST = ["📁", "📂", "💼", "📊", "📈", "📉", "🎯", "🚀", "💡", "⭐", "🔥", "🎨", "🎭", "🎪", "🎬"];
const COLOR_LIST = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#06B6D4", "#6366F1", "#14B8A6", "#F97316"];

export const ProjectsPage = () => {
  const tasks = useLifeStore((s) => s.tasks);
  const projects = useLifeStore((s) => s.projects);
  const addProject = useLifeStore((s) => s.addProject);
  const updateProject = useLifeStore((s) => s.updateProject);
  const renameProject = useLifeStore((s) => s.renameProject);
  const removeProject = useLifeStore((s) => s.removeProject);
  const addTask = useLifeStore((s) => s.addTask);
  const updateTask = useLifeStore((s) => s.updateTask);
  const toggleTask = useLifeStore((s) => s.toggleTask);
  const removeTask = useLifeStore((s) => s.removeTask);

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "completed" | "today" | "overdue">("all");
  const [sortBy, setSortBy] = useState<"name" | "created" | "tasks">("name");
  const [projectFormData, setProjectFormData] = useState({ name: "", icon: "📁", color: "#3B82F6" });
  const [taskFormData, setTaskFormData] = useState({
    title: "",
    priority: 4 as Priority,
    dueDate: "",
    projectId: "" as string | null
  });

  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  const editingTask = tasks.find((t) => t.id === editingTaskId);

  const projectTasks = selectedProjectId
    ? tasks.filter((t) => t.projectId === selectedProjectId)
    : tasks.filter((t) => t.projectId === null);

  const filteredTasks = useMemo(() => {
    let filtered = projectTasks;

    if (filterStatus === "active") {
      filtered = filtered.filter((t) => !t.completed);
    } else if (filterStatus === "completed") {
      filtered = filtered.filter((t) => t.completed);
    } else if (filterStatus === "today") {
      const today = new Date().toISOString().split("T")[0];
      filtered = filtered.filter((t) => t.dueDate === today && !t.completed);
    } else if (filterStatus === "overdue") {
      const today = new Date().toISOString().split("T")[0];
      filtered = filtered.filter((t) => t.dueDate && t.dueDate < today && !t.completed);
    }

    return filtered.sort((a, b) => a.order - b.order);
  }, [projectTasks, filterStatus]);

  const sortedProjects = useMemo(() => {
    const sorted = [...projects];
    if (sortBy === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "created") {
      sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    } else if (sortBy === "tasks") {
      const taskCounts = new Map(projects.map((p) => [p.id, tasks.filter((t) => t.projectId === p.id).length]));
      sorted.sort((a, b) => (taskCounts.get(b.id) ?? 0) - (taskCounts.get(a.id) ?? 0));
    }
    return sorted;
  }, [projects, tasks, sortBy]);

  const projectStats = useMemo(
    () =>
      projects.map((p) => {
        const pTasks = tasks.filter((t) => t.projectId === p.id);
        return {
          id: p.id,
          total: pTasks.length,
          completed: pTasks.filter((t) => t.completed).length,
          active: pTasks.filter((t) => !t.completed).length
        };
      }),
    [tasks, projects]
  );

  const inboxStats = useMemo(() => {
    const inboxTasks = tasks.filter((t) => t.projectId === null);
    return {
      total: inboxTasks.length,
      completed: inboxTasks.filter((t) => t.completed).length,
      active: inboxTasks.filter((t) => !t.completed).length
    };
  }, [tasks]);

  const handleSaveProject = () => {
    if (!projectFormData.name.trim()) return;

    if (editingProjectId) {
      renameProject(editingProjectId, projectFormData.name);
      updateProject(editingProjectId, {
        icon: projectFormData.icon,
        color: projectFormData.color
      });
    } else {
      addProject({
        name: projectFormData.name,
        icon: projectFormData.icon,
        color: projectFormData.color
      });
    }

    setProjectFormData({ name: "", icon: "📁", color: "#3B82F6" });
    setEditingProjectId(null);
    setShowCreateProjectModal(false);
  };

  const handleSaveTask = () => {
    if (!taskFormData.title.trim()) return;

    if (editingTaskId && editingTask) {
      updateTask(editingTaskId, {
        title: taskFormData.title,
        priority: taskFormData.priority,
        dueDate: taskFormData.dueDate || null,
        projectId: taskFormData.projectId
      });
    } else {
      addTask({
        title: taskFormData.title,
        priority: taskFormData.priority,
        dueDate: taskFormData.dueDate || null,
        projectId: taskFormData.projectId
      });
    }

    setTaskFormData({ title: "", priority: 4, dueDate: "", projectId: selectedProjectId });
    setEditingTaskId(null);
    setShowCreateTaskModal(false);
    setShowEditTaskModal(false);
  };

  const openTaskForm = (task?: Task) => {
    if (task) {
      setEditingTaskId(task.id);
      setTaskFormData({
        title: task.title,
        priority: task.priority,
        dueDate: task.dueDate || "",
        projectId: task.projectId
      });
      setShowEditTaskModal(true);
    } else {
      setEditingTaskId(null);
      setTaskFormData({
        title: "",
        priority: 4,
        dueDate: "",
        projectId: selectedProjectId
      });
      setShowCreateTaskModal(true);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">Projects</h1>
        <button
          onClick={() => {
            setShowCreateProjectModal(true);
            setEditingProjectId(null);
            setProjectFormData({ name: "", icon: "📁", color: "#3B82F6" });
          }}
          className="flex items-center gap-2 rounded-xl bg-app-lightAccent px-4 py-2 font-medium text-stone-900 active:scale-[0.97] dark:bg-app-darkAccent"
        >
          <Plus size={18} />
          Project
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Project List */}
        <Card className="space-y-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Projects</h2>
            <div className="relative group">
              <button className="p-1 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg">
                <ChevronDown size={16} />
              </button>
              <div className="absolute right-0 mt-1 bg-white dark:bg-stone-800 rounded-lg shadow-lg border border-stone-200 dark:border-stone-700 hidden group-hover:block z-10 min-w-max">
                <button
                  onClick={() => setSortBy("name")}
                  className={`block w-full text-left px-3 py-2 text-sm ${sortBy === "name" ? "bg-stone-100 dark:bg-stone-700" : ""}`}
                >
                  Sort by name
                </button>
                <button
                  onClick={() => setSortBy("created")}
                  className={`block w-full text-left px-3 py-2 text-sm ${sortBy === "created" ? "bg-stone-100 dark:bg-stone-700" : ""}`}
                >
                  Sort by created
                </button>
                <button
                  onClick={() => setSortBy("tasks")}
                  className={`block w-full text-left px-3 py-2 text-sm ${sortBy === "tasks" ? "bg-stone-100 dark:bg-stone-700" : ""}`}
                >
                  Sort by tasks
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => setSelectedProjectId(null)}
            className={`w-full rounded-xl px-3 py-2 text-left transition ${
              selectedProjectId === null
                ? "bg-app-lightAccent/20 text-stone-900 dark:bg-app-darkAccent/20 dark:text-white"
                : "border border-stone-200 hover:bg-stone-100 dark:border-stone-700 dark:hover:bg-stone-800"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">📭 Inbox</span>
              <span className="text-xs text-stone-500">{inboxStats.active}</span>
            </div>
          </button>

          {sortedProjects.length === 0 ? (
            <EmptyState title="No projects" subtitle="Create your first project." />
          ) : (
            sortedProjects.map((project) => {
              const stats = projectStats.find((s) => s.id === project.id);
              return (
                <div
                  key={project.id}
                  className={`rounded-xl px-3 py-2 transition border ${
                    selectedProjectId === project.id
                      ? "bg-app-lightAccent/20 border-app-lightAccent dark:bg-app-darkAccent/20 dark:border-app-darkAccent"
                      : "border-stone-200 hover:bg-stone-100 dark:border-stone-700 dark:hover:bg-stone-800"
                  }`}
                >
                  <button
                    onClick={() => setSelectedProjectId(project.id)}
                    className="w-full text-left"
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">
                        <span className="mr-2">{project.icon}</span>
                        <span className="font-medium">{project.name}</span>
                      </span>
                      <span className="text-xs text-stone-500">{stats?.active ?? 0}</span>
                    </div>
                  </button>
                  <div className="mt-1 flex items-center justify-between text-xs text-stone-500">
                    <span>{stats?.completed ?? 0}/{stats?.total ?? 0}</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setEditingProjectId(project.id);
                          setProjectFormData({ name: project.name, icon: project.icon, color: project.color });
                          setShowCreateProjectModal(true);
                        }}
                        className="hover:text-stone-700 dark:hover:text-stone-300"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => removeProject(project.id)}
                        className="hover:text-red-600 dark:hover:text-red-400"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </Card>

        {/* Task List */}
        <Card className="space-y-3 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold">
                {selectedProject ? `${selectedProject.icon} ${selectedProject.name}` : "📭 Inbox"}
              </h2>
              <p className="text-sm text-stone-500">
                {filteredTasks.length} tasks · {filteredTasks.filter((t) => t.completed).length} completed
              </p>
            </div>
            <button
              onClick={() => openTaskForm()}
              className="flex items-center gap-2 rounded-lg bg-app-lightAccent px-3 py-1 text-sm font-medium text-stone-900 active:scale-[0.97] dark:bg-app-darkAccent"
            >
              <Plus size={16} />
              Task
            </button>
          </div>

          <div className="flex gap-2 flex-wrap">
            {(["all", "active", "completed", "today", "overdue"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`rounded-lg px-3 py-1 text-sm transition ${
                  filterStatus === status
                    ? "bg-app-lightAccent/20 text-stone-900 dark:bg-app-darkAccent/20 dark:text-white"
                    : "border border-stone-300 hover:bg-stone-100 dark:border-stone-700 dark:hover:bg-stone-800"
                }`}
              >
                {status === "all" && "All"}
                {status === "active" && "Active"}
                {status === "completed" && "Completed"}
                {status === "today" && "Today"}
                {status === "overdue" && "Overdue"}
              </button>
            ))}
          </div>

          {filteredTasks.length === 0 ? (
            <EmptyState
              title={filterStatus === "all" ? "No tasks" : "No matching tasks"}
              subtitle={selectedProject ? "Add tasks to this project." : "Add tasks to inbox."}
            />
          ) : (
            <ul className="space-y-2">
              {filteredTasks.map((task) => (
                <li
                  key={task.id}
                  className={`rounded-xl border px-3 py-2 transition ${
                    isOverdue(task.dueDate) && !task.completed
                      ? "border-red-400/70 bg-red-50/60 dark:bg-red-950/20"
                      : "border-stone-200 hover:bg-stone-50 dark:border-stone-700 dark:hover:bg-stone-800/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <label className="flex items-start gap-2 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        className="mt-1"
                      />
                      <div className="min-w-0 flex-1 cursor-pointer" onClick={() => openTaskForm(task)}>
                        <p className={`truncate ${task.completed ? "line-through text-stone-500" : ""}`}>
                          {task.title}
                        </p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          <Badge text={`${priorityEmoji[task.priority]} P${task.priority}`} />
                          {task.dueDate && <Badge text={task.dueDate} />}
                          {task.labels.map((label) => (
                            <Badge key={label} text={`#${label}`} />
                          ))}
                          {task.subtasks.length > 0 && (
                            <Badge
                              text={`${task.subtasks.filter((s) => s.completed).length}/${task.subtasks.length}`}
                            />
                          )}
                        </div>
                      </div>
                    </label>
                    <button
                      onClick={() => removeTask(task.id)}
                      className="shrink-0 text-sm text-red-500 hover:text-red-600"
                    >
                      🗑
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Create/Edit Project Modal */}
      {showCreateProjectModal && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/50 sm:items-center sm:justify-center">
          <Card className="w-full max-w-md space-y-4 rounded-t-3xl p-6 sm:rounded-3xl">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">
                {editingProjectId ? "Edit Project" : "New Project"}
              </h2>
              <button
                onClick={() => setShowCreateProjectModal(false)}
                className="rounded-lg p-1 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                <X size={20} />
              </button>
            </div>

            <input
              type="text"
              value={projectFormData.name}
              onChange={(e) => setProjectFormData({ ...projectFormData, name: e.target.value })}
              placeholder="Project name"
              className="w-full rounded-xl border border-stone-300 bg-transparent px-3 py-2 outline-none focus:border-app-lightAccent dark:border-stone-700 dark:focus:border-app-darkAccent"
            />

            <div className="space-y-2">
              <p className="text-sm font-medium">Icon</p>
              <div className="grid grid-cols-8 gap-2">
                {EMOJI_LIST.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setProjectFormData({ ...projectFormData, icon: emoji })}
                    className={`rounded-lg px-2 py-2 text-lg transition ${
                      projectFormData.icon === emoji
                        ? "bg-app-lightAccent/20 ring-2 ring-app-lightAccent dark:bg-app-darkAccent/20 dark:ring-app-darkAccent"
                        : "hover:bg-stone-100 dark:hover:bg-stone-800"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Color</p>
              <div className="grid grid-cols-5 gap-2">
                {COLOR_LIST.map((color) => (
                  <button
                    key={color}
                    onClick={() => setProjectFormData({ ...projectFormData, color })}
                    className={`h-10 rounded-lg transition ${
                      projectFormData.color === color ? "ring-2 ring-offset-2 ring-stone-400" : ""
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              {editingProjectId && (
                <button
                  onClick={() => {
                    removeProject(editingProjectId);
                    setShowCreateProjectModal(false);
                    setSelectedProjectId(null);
                  }}
                  className="flex-1 rounded-xl border border-red-300 px-4 py-2 font-medium text-red-600 transition active:scale-[0.97] dark:border-red-600/40"
                >
                  Delete
                </button>
              )}
              <button
                onClick={() => setShowCreateProjectModal(false)}
                className="flex-1 rounded-xl border border-stone-300 px-4 py-2 font-medium transition active:scale-[0.97] dark:border-stone-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProject}
                className="flex-1 rounded-xl bg-app-lightAccent px-4 py-2 font-medium text-stone-900 transition active:scale-[0.97] dark:bg-app-darkAccent"
              >
                {editingProjectId ? "Save" : "Create"}
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Create Task Modal */}
      {showCreateTaskModal && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/50 sm:items-center sm:justify-center">
          <Card className="w-full max-w-md space-y-4 rounded-t-3xl p-6 sm:rounded-3xl">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">New Task</h2>
              <button
                onClick={() => setShowCreateTaskModal(false)}
                className="rounded-lg p-1 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                <X size={20} />
              </button>
            </div>

            <input
              type="text"
              value={taskFormData.title}
              onChange={(e) => setTaskFormData({ ...taskFormData, title: e.target.value })}
              placeholder="Name of task задачи"
              className="w-full rounded-xl border border-stone-300 bg-transparent px-3 py-2 outline-none focus:border-app-lightAccent dark:border-stone-700 dark:focus:border-app-darkAccent"
              autoFocus
            />

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Приоритет</label>
                <select
                  value={taskFormData.priority}
                  onChange={(e) => setTaskFormData({ ...taskFormData, priority: Number(e.target.value) as Priority })}
                  className="w-full rounded-lg border border-stone-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-app-lightAccent dark:border-stone-700 dark:focus:border-app-darkAccent"
                >
                  <option value={1}>🔴 P1</option>
                  <option value={2}>🟠 P2</option>
                  <option value={3}>🟡 P3</option>
                  <option value={4}>⚪ P4</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Проект</label>
                <select
                  value={taskFormData.projectId || ""}
                  onChange={(e) => setTaskFormData({ ...taskFormData, projectId: e.target.value || null })}
                  className="w-full rounded-lg border border-stone-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-app-lightAccent dark:border-stone-700 dark:focus:border-app-darkAccent"
                >
                  <option value="">📭 Inbox</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.icon} {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Due Date</label>
              <input
                type="date"
                value={taskFormData.dueDate}
                onChange={(e) => setTaskFormData({ ...taskFormData, dueDate: e.target.value })}
                className="w-full rounded-lg border border-stone-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-app-lightAccent dark:border-stone-700 dark:focus:border-app-darkAccent"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={() => setShowCreateTaskModal(false)}
                className="flex-1 rounded-xl border border-stone-300 px-4 py-2 font-medium transition active:scale-[0.97] dark:border-stone-700"
              >
                Отмена
              </button>
              <button
                onClick={handleSaveTask}
                className="flex-1 rounded-xl bg-app-lightAccent px-4 py-2 font-medium text-stone-900 transition active:scale-[0.97] dark:bg-app-darkAccent"
              >
                Создать
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Edit Task Modal */}
      {showEditTaskModal && editingTask && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/50 sm:items-center sm:justify-center">
          <Card className="w-full max-w-md space-y-4 rounded-t-3xl p-6 sm:rounded-3xl">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">Edit task</h2>
              <button
                onClick={() => setShowEditTaskModal(false)}
                className="rounded-lg p-1 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                <X size={20} />
              </button>
            </div>

            <input
              type="text"
              value={taskFormData.title}
              onChange={(e) => setTaskFormData({ ...taskFormData, title: e.target.value })}
              placeholder="Name of task"
              className="w-full rounded-xl border border-stone-300 bg-transparent px-3 py-2 outline-none focus:border-app-lightAccent dark:border-stone-700 dark:focus:border-app-darkAccent"
              autoFocus
            />

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Приоритет</label>
                <select
                  value={taskFormData.priority}
                  onChange={(e) => setTaskFormData({ ...taskFormData, priority: Number(e.target.value) as Priority })}
                  className="w-full rounded-lg border border-stone-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-app-lightAccent dark:border-stone-700 dark:focus:border-app-darkAccent"
                >
                  <option value={1}>🔴 P1</option>
                  <option value={2}>🟠 P2</option>
                  <option value={3}>🟡 P3</option>
                  <option value={4}>⚪ P4</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Проект</label>
                <select
                  value={taskFormData.projectId || ""}
                  onChange={(e) => setTaskFormData({ ...taskFormData, projectId: e.target.value || null })}
                  className="w-full rounded-lg border border-stone-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-app-lightAccent dark:border-stone-700 dark:focus:border-app-darkAccent"
                >
                  <option value="">📭 Inbox</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.icon} {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Due Date</label>
              <input
                type="date"
                value={taskFormData.dueDate}
                onChange={(e) => setTaskFormData({ ...taskFormData, dueDate: e.target.value })}
                className="w-full rounded-lg border border-stone-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-app-lightAccent dark:border-stone-700 dark:focus:border-app-darkAccent"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={() => setShowEditTaskModal(false)}
                className="flex-1 rounded-xl border border-stone-300 px-4 py-2 font-medium transition active:scale-[0.97] dark:border-stone-700"
              >
                Отмена
              </button>
              <button
                onClick={handleSaveTask}
                className="flex-1 rounded-xl bg-app-lightAccent px-4 py-2 font-medium text-stone-900 transition active:scale-[0.97] dark:bg-app-darkAccent"
              >
                Сохранить
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
