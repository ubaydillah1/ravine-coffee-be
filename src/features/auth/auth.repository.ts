import prisma from "../../lib/prisma.js";

export const AuthRepository = {
  async existingEmail(email: string) {
    return await prisma.user.findUnique({ where: { email } });
  },
};
