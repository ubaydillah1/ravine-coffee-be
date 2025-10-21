import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const PasswordUtils = {
  async hash(password: string) {
    return bcrypt.hash(password, SALT_ROUNDS);
  },

  async compare(plain: string, hashed: string) {
    return bcrypt.compare(plain, hashed);
  },
};
