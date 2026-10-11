import { z } from "zod";
import { TASK_STATUSES } from "./constants";

const dueDate = z
  .string()
  .datetime({ offset: true })
  .nullable()
  .transform((v) => (v ? new Date(v) : null));

export const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().max(5000).default(""),
  status: z.enum(TASK_STATUSES).default("TODO"),
  priority: z.number().int().min(1).max(3).default(2),
  assigneeId: z.string().nullable().default(null),
  dueDate: dueDate.default(null),
});
export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1).max(200),
    description: z.string().max(5000),
    status: z.enum(TASK_STATUSES),
    priority: z.number().int().min(1).max(3),
    assigneeId: z.string().nullable(),
    dueDate,
  })
  .partial();
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
