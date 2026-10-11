import { cookies } from "next/headers";
import { prisma } from "./db";
import { HttpError } from "./http";

export const SESSION_COOKIE = "uid";

/**
 * Fake authentication for this exercise: the current user is whoever is stored
 * in the `uid` cookie (switchable from the header). Treat it as if it were a
 * real, trusted session — you do NOT need to build real auth.
 */
export async function getCurrentUser() {
  const store = await cookies();
  const uid = store.get(SESSION_COOKIE)?.value;

  const user = uid
    ? await prisma.user.findUnique({ where: { id: uid } })
    : await prisma.user.findFirst({ orderBy: { createdAt: "asc" } });

  if (!user) throw new HttpError(401, "Not signed in");
  return user;
}
