import { UserRole, UserStatus, type User } from "@prisma/client";
import prisma from "../../lib/prisma.js";
import type { CashierQueryType, CashierType } from "./user.types.js";
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

  async getAll({ limit, cursor }: CashierQueryType) {
    const cashier = await prisma.user.findMany({
      where: { role: UserRole.CASHIER },
      take: limit,
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
      orderBy: { createdAt: "desc" },
    });

    let nextCursor = null;

    if (cashier.length > limit) nextCursor = cashier.pop()?.id;

    return { cashier, nextCursor };
  },

  async changeStatus(id: string, status: UserStatus) {
    return prisma.user.update({ where: { id }, data: { status } });
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

  async editProfile(id: string, data: User, fileLink?: string) {
    return prisma.user.update({
      where: { id },
      data: { ...data, ...(fileLink && { avatar: fileLink }) },
    });
  },

  async removeAvatar(id: string) {
    return prisma.user.update({ where: { id }, data: { avatar: null } });
  },
};
