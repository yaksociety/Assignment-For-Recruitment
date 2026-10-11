import { prisma } from "./db";
import { forbidden } from "./http";

/** Throws 403 unless the user belongs to the team. Returns the membership. */
export async function requireMembership(userId: string, teamId: string) {
  const membership = await prisma.membership.findUnique({
    where: { userId_teamId: { userId, teamId } },
  });
  if (!membership) throw forbidden();
  return membership;
}
