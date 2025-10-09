import { BadRequestError } from "../../utils/errors.js";
import { UserRepository } from "./user.repository.js";
import type { CashierInput } from "./user.types.js";
import bcrypt from "bcrypt";

export const UserService = {
  async createUser(data: CashierInput) {
    const existingUser = await UserRepository.existingEmail(data.email);
    if (existingUser) throw new BadRequestError("User already exists");

    const hashed = await bcrypt.hash(data.password, 10);

    return await UserRepository.createCashier({
      ...data,
      password: hashed,
    });
  },
};
