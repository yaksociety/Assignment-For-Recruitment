"use client";

import { useRouter } from "next/navigation";

type Props = { currentUserId: string; users: { id: string; name: string }[] };

/** Dev-only: lets you act as any seeded user. */
export function UserSwitcher({ currentUserId, users }: Props) {
  const router = useRouter();

  async function onChange(userId: string) {
    await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    router.push("/");
    router.refresh();
  }

  return (
    <label className="switcher">
      Signed in as
      <select value={currentUserId} onChange={(e) => onChange(e.target.value)}>
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name}
          </option>
        ))}
      </select>
    </label>
  );
}
