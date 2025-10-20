import type { Request, Response } from "express";
import { AuthService } from "./auth.service.js";

export const AuthContoller = {
  async login(req: Request, res: Response) {
    const data = req.body;

    const { token } = await AuthService.login(data);

    res.json({ message: "Login successful", result: token });
  },

  async registerIfNotExists(req: Request, res: Response) {
    const data = req.body;

    const user = await AuthService.registerIfNotExists(data);

    res.json({ message: "User registered successfully", result: user });
  },

  async me(req: Request, res: Response) {
    const id = req.user?.id;

    if (!id) throw new Error("User not found");

    const user = await AuthService.me(id);

    res.json({ message: "User fetched successfully", result: user });
  },
};
