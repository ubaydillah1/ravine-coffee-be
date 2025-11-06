import { UserRole } from "@prisma/client";
import prisma from "../../lib/prisma.js";
import type { RegisterInput } from "./auth.types.js";

export const AuthRepository = {
  async existingEmail(email: string) {
    return await prisma.user.findUnique({ where: { email } });
  },

  async registerIfNotExist(data: RegisterInput) {
    return await prisma.user.create({
      data: {
        ...data,
        phoneNumber: data.phoneNumber ?? null,
        role: UserRole.USER,
      },
    });
  },

  async me(id: string) {
    return await prisma.user.findUnique({
      where: { id },
    });
  },
};
