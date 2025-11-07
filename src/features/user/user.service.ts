import { UserRole, UserStatus, type User } from "@prisma/client";
import { UserRepository } from "./user.repository.js";
import type { CashierQueryType, CashierType } from "./user.types.js";
import bcrypt from "bcrypt";
import { BadRequestError, NotFoundError } from "../../utils/errors.js";
import {
  deleteFromSupabase,
  uploadToSupabase,
} from "../../utils/supabaseUploader.js";

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

  async getAllCashiers({ limit, cursor }: CashierQueryType) {
    return UserRepository.getAll({ limit, cursor });
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

  async changeStatus(id: string, status: UserStatus) {
    const cashier = await UserRepository.getById(id);
    if (!cashier) throw new NotFoundError("Cashier not found");

    return UserRepository.changeStatus(id, status);
  },

  async editProfile(id: string, data: User, file?: Express.Multer.File) {
    const exisistingUser = await UserRepository.getById(id);
    if (!exisistingUser) throw new NotFoundError("Cashier not found");

    if (exisistingUser.avatar) {
      await deleteFromSupabase(exisistingUser.avatar, "avatars");
    }

    let fileLink = exisistingUser.avatar ?? undefined;

    if (file) {
      fileLink = await uploadToSupabase(file, "avatars");
    }

    return UserRepository.editProfile(id, data, fileLink);
  },

  async removeAvatar(id: string) {
    const exisistingUser = await UserRepository.getById(id);
    if (!exisistingUser) throw new NotFoundError("Cashier not found");

    if (exisistingUser.avatar) {
      await deleteFromSupabase(exisistingUser.avatar, "avatars");
    }

    return UserRepository.removeAvatar(id);
  },
};
