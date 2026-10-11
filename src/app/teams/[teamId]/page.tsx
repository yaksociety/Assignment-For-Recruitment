import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { Board } from "@/components/Board";

export default async function TeamPage({ params }: { params: Promise<{ teamId: string }> }) {
  const { teamId } = await params;
  const user = await getCurrentUser();
  const membership = await prisma.membership.findUnique({
    where: { userId_teamId: { userId: user.id, teamId } },
    include: { team: true },
  });
  if (!membership) notFound();

  return (
    <>
      <h1>{membership.team.name}</h1>
      <Board teamId={teamId} />
    </>
  );
}
