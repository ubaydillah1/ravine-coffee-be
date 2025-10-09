import { UserRole } from "@prisma/client";
import {
  deleteFromSupabase,
  uploadToSupabase,
} from "../../lib/storage/supabaseUploader.js";
import { UserRepository } from "./user.repository.js";
import type { CashierType } from "./user.types.js";
import bcrypt from "bcrypt";
import { BadRequestError, NotFoundError } from "../../utils/errors.js";

export const UserService = {
  async createCashier(data: CashierType, file?: Express.Multer.File) {
    let avatarUrl: string | undefined;

    const exisistingUser = await UserRepository.getByEmail(data.email);
    if (exisistingUser) throw new BadRequestError("User already exists");

    if (file) {
      avatarUrl = await uploadToSupabase(file, "avatars");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return UserRepository.create(
      {
        email: data.email,
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        password: hashedPassword,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        city: data.city ?? null,
        role: UserRole.CASHIER,
      },
      avatarUrl
    );
  },

  async getAllCashiers(limit: number, offset: number) {
    return UserRepository.getAll(limit, offset);
  },

  async getCashierById(id: string) {
    const cashier = await UserRepository.getById(id);
    if (!cashier) throw new NotFoundError("Cashier not found");
    return cashier;
  },

  async deleteCashier(id: string) {
    const cashier = await UserRepository.getById(id);
    if (!cashier) throw new NotFoundError("Cashier not found");

    if (cashier.avatar) {
      await deleteFromSupabase(cashier.avatar, "avatars");
    }

    return UserRepository.delete(id);
  },

  async updateCashier(
    id: string,
    data: CashierType,
    file?: Express.Multer.File
  ) {
    let avatarUrl: string | undefined;

    const exisistingUser = await UserRepository.getById(id);
    if (!exisistingUser) throw new NotFoundError("Cashier not found");

    if (exisistingUser.avatar) {
      await deleteFromSupabase(exisistingUser.avatar, "avatars");
    }

    if (file) {
      avatarUrl = await uploadToSupabase(file, "avatars");
    }

    return UserRepository.update(id, data, avatarUrl);
  },
};
