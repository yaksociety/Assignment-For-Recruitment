import type { TaskView } from "@/lib/tasks";

export type Member = { id: string; name: string; role: string };

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error ?? `Request failed (${res.status})`);
  return body as T;
}

export const api = {
  listTasks: (teamId: string) =>
    request<{ tasks: TaskView[] }>(`/api/teams/${teamId}/tasks`).then((r) => r.tasks),
  listMembers: (teamId: string) =>
    request<{ members: Member[] }>(`/api/teams/${teamId}/members`).then((r) => r.members),
  createTask: (teamId: string, data: Record<string, unknown>) =>
    request<{ task: TaskView }>(`/api/teams/${teamId}/tasks`, {
      method: "POST",
      body: JSON.stringify(data),
    }).then((r) => r.task),
  updateTask: (taskId: string, data: Record<string, unknown>) =>
    request<{ task: TaskView }>(`/api/tasks/${taskId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }).then((r) => r.task),
};
