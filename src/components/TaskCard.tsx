"use client";

import type { TaskView } from "@/lib/tasks";
import { STATUS_LABELS, TASK_STATUSES } from "@/lib/constants";
import { formatDate, PRIORITY_LABELS } from "@/lib/format";
import type { Member } from "./api";

type Props = {
  task: TaskView;
  members: Member[];
  onChange: (data: Record<string, unknown>) => void;
};

export function TaskCard({ task, members, onChange }: Props) {
  return (
    <article className={`card priority-${task.priority}`}>
      <h3>{task.title}</h3>
      <div className="meta">
        <span>{PRIORITY_LABELS[task.priority]}</span>
        {task.dueDate && <span>Due {formatDate(task.dueDate)}</span>}
        {task.commentCount > 0 && <span>{task.commentCount} comments</span>}
      </div>
      <div className="controls">
        <select
          aria-label="Status"
          value={task.status}
          onChange={(e) => onChange({ status: e.target.value })}
        >
          {TASK_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <select
          aria-label="Assignee"
          value={task.assignee?.id ?? ""}
          onChange={(e) => onChange({ assigneeId: e.target.value || null })}
        >
          <option value="">Unassigned</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>
    </article>
  );
}
