import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({ log: ["error"] });

export async function connectDatabase() {
  await prisma.$connect();
}

export async function disconnectDatabase() {
  await prisma.$disconnect();
}
