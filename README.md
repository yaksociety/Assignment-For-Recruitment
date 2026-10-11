# Team Task Board — Full Stack Assignment

แอปจัดการงานของทีมขนาดเล็ก ใช้สำหรับแบบทดสอบตำแหน่ง **Full Stack Developer (Mid-level)**

โจทย์ทั้งหมดอยู่ใน **[ASSIGNMENT.md](./ASSIGNMENT.md)** — อ่านไฟล์นั้นก่อนเริ่ม

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Prisma 7 + SQLite (ผ่าน `@prisma/adapter-better-sqlite3`) — ไม่ต้องติดตั้ง database แยก
- Zod สำหรับ validation, Vitest สำหรับ test

## เริ่มต้นใช้งาน

ต้องการ Node.js 20.19+ หรือ 22+

```bash
npm install
cp .env.example .env
npm run setup      # สร้างตาราง + ใส่ข้อมูลตัวอย่าง
npm run dev        # http://localhost:3000
```

คำสั่งอื่นที่มีให้

| คำสั่ง | ทำอะไร |
| --- | --- |
| `npm run db:migrate` | สร้าง migration ใหม่หลังแก้ `prisma/schema.prisma` |
| `npm run db:reset` | ล้าง database แล้ว seed ใหม่ |
| `npm test` | รัน test |
| `npm run typecheck` | ตรวจ type |
| `PRISMA_LOG_QUERIES=1 npm run dev` | แสดง SQL ทุก query ใน console ของ server |

## โครงสร้างโปรเจกต์

```
prisma/
  schema.prisma        โมเดลข้อมูล
  migrations/          migration ของ database
  seed.ts              ข้อมูลตัวอย่าง (2 ทีม, 8 คน, 440 งาน)
src/
  app/                 หน้าเว็บและ API routes (Next.js App Router)
    api/teams/[teamId]/tasks    GET รายการงาน, POST สร้างงาน
    api/teams/[teamId]/members  GET สมาชิกในทีม
    api/tasks/[taskId]          PATCH แก้ไขงาน
    api/session                 POST สลับผู้ใช้ (dev only)
  components/          React components ฝั่ง client
  lib/                 business logic
    tasks.ts           service หลักของ task
    authz.ts           ตรวจสิทธิ์การเป็นสมาชิกทีม
    session.ts         ระบบ login จำลอง
    validation.ts      Zod schemas
review/                ไฟล์สำหรับโจทย์ข้อ 3
```

**แนวทางของโค้ดเดิม:** route handler ทำหน้าที่แค่รับ request, validate ด้วย Zod แล้วเรียก service ใน `src/lib` ส่วนการตรวจสิทธิ์และ business logic อยู่ใน service ทั้งหมด

## เรื่อง Login

ไม่มีระบบ login จริง ผู้ใช้ปัจจุบันเก็บใน cookie และสลับได้จาก dropdown มุมขวาบน ให้ถือว่าเป็น session ที่เชื่อถือได้ ไม่ต้องสร้างระบบ auth เพิ่ม

ข้อมูลตัวอย่าง: ทีม **Product** มี Ploy, Nat, Beam, Fah, Ton, June และทีม **Finance** มี Mint, Boss, June (June อยู่ทั้งสองทีม)
