/**
 * Sends a notification to the team's chat webhook when a task changes.
 *
 * In development the webhook is stubbed: we just log and simulate network
 * latency so local behaviour is close to production.
 */
export async function notifyTaskChanged(params: {
  taskId: string;
  title: string;
  actorId: string;
  changes: Record<string, [unknown, unknown]>;
}) {
  const webhook = process.env.TEAM_WEBHOOK_URL;
  if (webhook) {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    return;
  }

  // Stub: ~80–200ms, roughly what the real webhook takes.
  await new Promise((resolve) => setTimeout(resolve, 80 + Math.random() * 120));
  if (process.env.NODE_ENV !== "production") {
    console.log(`[notify] task ${params.taskId} changed: ${Object.keys(params.changes).join(", ")}`);
  }
}
