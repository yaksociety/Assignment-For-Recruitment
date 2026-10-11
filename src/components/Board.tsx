"use client";

import { useCallback, useEffect, useState } from "react";
import type { TaskView } from "@/lib/tasks";
import { STATUS_LABELS, TASK_STATUSES } from "@/lib/constants";
import { api, type Member } from "./api";
import { TaskCard } from "./TaskCard";
import { NewTaskForm } from "./NewTaskForm";

export function Board({ teamId }: { teamId: string }) {
  const [tasks, setTasks] = useState<TaskView[] | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [t, m] = await Promise.all([api.listTasks(teamId), api.listMembers(teamId)]);
      setTasks(t);
      setMembers(m);
    } catch (e) {
      setError((e as Error).message);
    }
  }, [teamId]);

  useEffect(() => {
    load();
  }, [load]);

  async function update(taskId: string, data: Record<string, unknown>) {
    try {
      const updated = await api.updateTask(taskId, data);
      setTasks((prev) => prev?.map((t) => (t.id === updated.id ? updated : t)) ?? null);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function create(data: Record<string, unknown>) {
    const task = await api.createTask(teamId, data);
    setTasks((prev) => (prev ? [task, ...prev] : [task]));
  }

  if (error) return <p className="error">{error}</p>;
  if (!tasks) return <p className="empty">Loading tasks…</p>;

  return (
    <>
      <NewTaskForm members={members} onCreate={create} />
      <div className="board">
        {TASK_STATUSES.map((status) => {
          const column = tasks.filter((t) => t.status === status);
          return (
            <section key={status} className="column">
              <h2>
                {STATUS_LABELS[status]} <span className="count">{column.length}</span>
              </h2>
              {column.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  members={members}
                  onChange={(data) => update(task.id, data)}
                />
              ))}
            </section>
          );
        })}
      </div>
    </>
  );
}
