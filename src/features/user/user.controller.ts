import type { Request, Response } from "express";
import { UserService } from "./user.service.js";

export const UserController = {
  async createCashier(req: Request, res: Response) {
    const data = req.body;

    await UserService.createCashier(data);

    res.json({ message: "User created successfully" });
  },
};
