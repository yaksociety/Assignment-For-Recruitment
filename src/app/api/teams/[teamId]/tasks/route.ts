import { NextResponse } from "next/server";
import { handle } from "@/lib/http";
import { getCurrentUser } from "@/lib/session";
import { createTask, listTasksForTeam } from "@/lib/tasks";
import { createTaskSchema } from "@/lib/validation";

type Ctx = { params: Promise<{ teamId: string }> };

export const GET = handle(async (_req: Request, { params }: Ctx) => {
  const { teamId } = await params;
  const user = await getCurrentUser();
  const tasks = await listTasksForTeam(user.id, teamId);
  return NextResponse.json({ tasks });
});

export const POST = handle(async (req: Request, { params }: Ctx) => {
  const { teamId } = await params;
  const user = await getCurrentUser();
  const input = createTaskSchema.parse(await req.json());
  const task = await createTask(user.id, teamId, input);
  return NextResponse.json({ task }, { status: 201 });
});
