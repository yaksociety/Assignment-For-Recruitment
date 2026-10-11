import { NextResponse } from "next/server";
import { handle } from "@/lib/http";
import { getCurrentUser } from "@/lib/session";
import { updateTask } from "@/lib/tasks";
import { updateTaskSchema } from "@/lib/validation";

type Ctx = { params: Promise<{ taskId: string }> };

export const PATCH = handle(async (req: Request, { params }: Ctx) => {
  const { taskId } = await params;
  const user = await getCurrentUser();
  const input = updateTaskSchema.parse(await req.json());
  const task = await updateTask(user.id, taskId, input);
  return NextResponse.json({ task });
});
