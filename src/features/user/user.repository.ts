import prisma from "../../lib/prisma.js";
import type { CashierInput } from "./user.types.js";

export const UserRepository = {
  async createCashier(data: CashierInput) {
    return prisma.user.create({ data });
  },

  async existingEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  async getUserById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  async getAllUser(limit: number = 10, offset: number = 0) {
    return prisma.user.findMany({
      take: limit,
      skip: offset,
      where: { role: "USER" },
      select: { id: true, email: true, fullName: true },
    });
  },

  async getAllCashier(limit: number = 10, offset: number = 0) {
    return prisma.user.findMany({
      take: limit,
      skip: offset,
      where: { role: "CASHIER" },
      select: { id: true, email: true, fullName: true, avatar: true },
    });
  },
};
