import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}
export const prisma = global.prisma || new PrismaClient();

// Prevent prisma create new instances everytime this file is called
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
