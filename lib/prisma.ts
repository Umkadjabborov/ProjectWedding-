// =============================================================
// FAYL: lib/prisma.ts
// MAQSAD: Prisma Client singleton — bitta PrismaClient instance
//         yaratib, uni global o'zgaruvchida saqlaydi.
//         Next.js development rejimida hot-reload paytida
//         har safar yangi connection ochilishining oldini oladi.
//         Production da global saqlanmaydi (memory leak oldini olish).
// =============================================================

import { PrismaClient } from "@prisma/client";

// Global tipni kengaytirish — TypeScript uchun
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Agar global da mavjud bo'lsa — uni ishlatamiz
// Aks holda — yangi PrismaClient yaratamiz
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // Development da xato va ogohlantirishlarni console ga chiqarish
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

// Development da global ga saqlaymiz (hot-reload uchun)
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
