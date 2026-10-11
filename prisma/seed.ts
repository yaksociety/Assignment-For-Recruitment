import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" }),
});

// Deterministic pseudo-random so every candidate gets the same data.
let seed = 42;
function rand() {
  seed = (seed * 1103515245 + 12345) % 2 ** 31;
  return seed / 2 ** 31;
}
function pick<T>(items: T[]): T {
  return items[Math.floor(rand() * items.length)];
}

const STATUSES = ["TODO", "IN_PROGRESS", "DONE"];
const VERBS = ["Fix", "Design", "Write", "Review", "Refactor", "Migrate", "Test", "Document"];
const NOUNS = ["login page", "billing API", "onboarding flow", "search index", "email templates", "dashboard", "mobile layout", "export job", "audit log", "settings page"];

async function main() {
  await prisma.activity.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.team.deleteMany();
  await prisma.user.deleteMany();

  const people = ["Ploy", "Nat", "Beam", "Fah", "Ton", "Mint", "Boss", "June"];
  const users = await Promise.all(
    people.map((name) =>
      prisma.user.create({ data: { name, email: `${name.toLowerCase()}@example.com` } }),
    ),
  );

  const product = await prisma.team.create({ data: { name: "Product" } });
  const finance = await prisma.team.create({ data: { name: "Finance" } });

  // Product: first 5 users. Finance: last 4 users (June is in both).
  const productMembers = users.slice(0, 5).concat(users[7]);
  const financeMembers = users.slice(5);

  for (const [i, u] of productMembers.entries()) {
    await prisma.membership.create({
      data: { userId: u.id, teamId: product.id, role: i === 0 ? "OWNER" : "MEMBER" },
    });
  }
  for (const [i, u] of financeMembers.entries()) {
    await prisma.membership.create({
      data: { userId: u.id, teamId: finance.id, role: i === 0 ? "OWNER" : "MEMBER" },
    });
  }

  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  async function makeTasks(teamId: string, members: typeof users, count: number) {
    for (let i = 0; i < count; i++) {
      const creator = pick(members);
      const assignee = rand() < 0.85 ? pick(members) : null;
      const hasDue = rand() < 0.7;
      const task = await prisma.task.create({
        data: {
          title: `${pick(VERBS)} ${pick(NOUNS)} #${i + 1}`,
          description: "Seeded task.",
          status: pick(STATUSES),
          priority: 1 + Math.floor(rand() * 3),
          teamId,
          createdById: creator.id,
          assigneeId: assignee?.id ?? null,
          dueDate: hasDue ? new Date(now + Math.floor((rand() * 30 - 10) * day)) : null,
        },
      });
      const commentCount = Math.floor(rand() * 4);
      for (let c = 0; c < commentCount; c++) {
        await prisma.comment.create({
          data: { taskId: task.id, authorId: pick(members).id, body: "Looks good, will follow up." },
        });
      }
    }
  }

  // Product is intentionally large so performance problems are noticeable.
  await makeTasks(product.id, productMembers, 400);
  await makeTasks(finance.id, financeMembers, 40);

  console.log(`Seeded ${users.length} users, 2 teams, 440 tasks.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
