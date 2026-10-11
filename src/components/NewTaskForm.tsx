"use client";

import { useState } from "react";
import type { Member } from "./api";

type Props = {
  members: Member[];
  onCreate: (data: Record<string, unknown>) => Promise<void>;
};

export function NewTaskForm({ members, onCreate }: Props) {
  const [title, setTitle] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState(2);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onCreate({
        title,
        priority,
        assigneeId: assigneeId || null,
        dueDate: dueDate ? new Date(`${dueDate}T00:00:00Z`).toISOString() : null,
      });
      setTitle("");
      setAssigneeId("");
      setDueDate("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="new-task" onSubmit={submit}>
      <input
        placeholder="New task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <select value={priority} onChange={(e) => setPriority(Number(e.target.value))}>
        <option value={1}>High</option>
        <option value={2}>Medium</option>
        <option value={3}>Low</option>
      </select>
      <select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}>
        <option value="">Unassigned</option>
        {members.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>
      <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      <button type="submit" disabled={saving}>
        Add task
      </button>
      {error && <span className="error">{error}</span>}
    </form>
  );
}
