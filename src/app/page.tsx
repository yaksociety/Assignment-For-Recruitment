import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export default async function Home() {
  const user = await getCurrentUser();
  const membership = await prisma.membership.findFirst({ where: { userId: user.id } });
  if (membership) redirect(`/teams/${membership.teamId}`);
  return <p className="empty">You are not a member of any team yet.</p>;
}
