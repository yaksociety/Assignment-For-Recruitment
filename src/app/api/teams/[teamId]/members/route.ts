import { NextResponse } from "next/server";
import { handle } from "@/lib/http";
import { getCurrentUser } from "@/lib/session";
import { listTeamMembers } from "@/lib/tasks";

type Ctx = { params: Promise<{ teamId: string }> };

export const GET = handle(async (_req: Request, { params }: Ctx) => {
  const { teamId } = await params;
  const user = await getCurrentUser();
  const members = await listTeamMembers(user.id, teamId);
  return NextResponse.json({ members });
});
