import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { UserSwitcher } from "@/components/UserSwitcher";
import "./globals.css";

export const metadata: Metadata = { title: "Team Task Board" };
export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const [users, memberships] = await Promise.all([
    prisma.user.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.membership.findMany({
      where: { userId: user.id },
      include: { team: { select: { id: true, name: true } } },
    }),
  ]);

  return (
    <html lang="en">
      <body>
        <header className="topbar">
          <Link href="/" className="brand">
            Team Task Board
          </Link>
          <nav className="teams">
            {memberships.map((m) => (
              <Link key={m.team.id} href={`/teams/${m.team.id}`}>
                {m.team.name}
              </Link>
            ))}
          </nav>
          <UserSwitcher currentUserId={user.id} users={users} />
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
