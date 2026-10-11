import type { Task } from "@/generated/prisma/client";
import { prisma } from "./db";
import { requireMembership } from "./authz";
import { HttpError, notFound } from "./http";
import { notifyTaskChanged } from "./notify";
import type { CreateTaskInput, UpdateTaskInput } from "./validation";

/** Shape returned to the client. Dates are ISO strings. */
export type TaskView = {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: number;
  teamId: string;
  assignee: { id: string; name: string } | null;
  dueDate: string | null;
  commentCount: number;
  updatedAt: string;
};

async function toTaskView(task: Task): Promise<TaskView> {
  const assignee = task.assigneeId
    ? await prisma.user.findUnique({
        where: { id: task.assigneeId },
        select: { id: true, name: true },
      })
    : null;
  const commentCount = await prisma.comment.count({ where: { taskId: task.id } });

  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    teamId: task.teamId,
    assignee,
    dueDate: task.dueDate?.toISOString() ?? null,
    commentCount,
    updatedAt: task.updatedAt.toISOString(),
  };
}

export async function listTasksForTeam(userId: string, teamId: string): Promise<TaskView[]> {
  await requireMembership(userId, teamId);

  const tasks = await prisma.task.findMany({
    where: { teamId },
    orderBy: [{ priority: "asc" }, { createdAt: "desc" }],
  });

  const views: TaskView[] = [];
  for (const task of tasks) {
    views.push(await toTaskView(task));
  }
  return views;
}

async function assertAssigneeInTeam(assigneeId: string | null | undefined, teamId: string) {
  if (!assigneeId) return;
  const m = await prisma.membership.findUnique({
    where: { userId_teamId: { userId: assigneeId, teamId } },
  });
  if (!m) throw new HttpError(400, "Assignee must be a member of the team");
}

export async function createTask(userId: string, teamId: string, input: CreateTaskInput) {
  await requireMembership(userId, teamId);
  await assertAssigneeInTeam(input.assigneeId, teamId);

  const task = await prisma.task.create({
    data: { ...input, teamId, createdById: userId },
  });
  await prisma.activity.create({
    data: { taskId: task.id, actorId: userId, changes: JSON.stringify({ created: true }) },
  });
  return toTaskView(task);
}

const TRACKED_FIELDS = ["title", "description", "status", "priority", "assigneeId", "dueDate"] as const;

export async function updateTask(userId: string, taskId: string, input: UpdateTaskInput) {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw notFound("Task");
  await requireMembership(userId, task.teamId);
  await assertAssigneeInTeam(input.assigneeId, task.teamId);

  // Merge the incoming partial update onto the current task.
  const next = {
    title: input.title ?? task.title,
    description: input.description ?? task.description,
    status: input.status ?? task.status,
    priority: input.priority ?? task.priority,
    assigneeId: input.assigneeId !== undefined ? input.assigneeId : task.assigneeId,
    dueDate: input.dueDate !== undefined ? input.dueDate : task.dueDate,
  };

  const changes: Record<string, [unknown, unknown]> = {};
  for (const field of TRACKED_FIELDS) {
    const before = task[field];
    const after = next[field];
    const same =
      before instanceof Date || after instanceof Date
        ? (before as Date | null)?.getTime() === (after as Date | null)?.getTime()
        : before === after;
    if (!same) changes[field] = [before, after];
  }
  if (Object.keys(changes).length === 0) return toTaskView(task);

  await prisma.activity.create({
    data: { taskId, actorId: userId, changes: JSON.stringify(changes) },
  });
  await notifyTaskChanged({ taskId, title: next.title, actorId: userId, changes });

  const updated = await prisma.task.update({ where: { id: taskId }, data: next });
  return toTaskView(updated);
}

export async function listTeamMembers(userId: string, teamId: string) {
  await requireMembership(userId, teamId);
  const memberships = await prisma.membership.findMany({
    where: { teamId },
    include: { user: { select: { id: true, name: true } } },
    orderBy: { user: { name: "asc" } },
  });
  return memberships.map((m) => ({ ...m.user, role: m.role }));
}
