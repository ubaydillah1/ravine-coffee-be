import { UserRole } from "@prisma/client";
import prisma from "../../lib/prisma.js";
import type { CashierType } from "./user.types.js";
export const UserRepository = {
  async create(data: CashierType, fileLink?: string) {
    return prisma.user.create({
      data: {
        ...data,
        ...(fileLink && { avatar: fileLink }),
      },
    });
  },

  async getByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  async getAll(limit: number = 10, offset: number = 0) {
    return prisma.user.findMany({
      where: { role: UserRole.CASHIER },
      skip: offset,
      take: limit,
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  async update(id: string, data: CashierType, fileLink?: string) {
    return prisma.user.update({
      where: { id },
      data: { ...data, ...(fileLink && { avatar: fileLink }) },
    });
  },

  async delete(id: string) {
    return prisma.user.delete({ where: { id } });
  },
};
