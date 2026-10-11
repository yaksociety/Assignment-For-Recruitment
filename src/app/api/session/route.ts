import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { handle, notFound } from "@/lib/http";
import { SESSION_COOKIE } from "@/lib/session";

// Dev-only "sign in as" endpoint used by the user switcher in the header.
export const POST = handle(async (req: Request) => {
  const { userId } = z.object({ userId: z.string() }).parse(await req.json());
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw notFound("User");

  const res = NextResponse.json({ user });
  res.cookies.set(SESSION_COOKIE, user.id, { httpOnly: true, sameSite: "lax", path: "/" });
  return res;
});
