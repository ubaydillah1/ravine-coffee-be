import { BadRequestError, NotFoundError } from "../../utils/errors.js";
import { AuthRepository } from "./auth.repository.js";
import { PasswordUtils } from "../../utils/password.js";
import type { LoginInput } from "./auth.types.js";
import { generateToken } from "../../helpers/token.js";

export const AuthService = {
  async login(data: LoginInput) {
    const user = await AuthRepository.existingEmail(data.email);

    if (!user) throw new NotFoundError("User not found");
    if (!user.password) throw new BadRequestError("User is Customer");

    const isValid = PasswordUtils.compare(data.password, user.password!);

    if (!isValid) throw new BadRequestError("Invalid credentials");

    const token = generateToken({ id: user.id, email: user.email });

    return { user, token };
  },
};
