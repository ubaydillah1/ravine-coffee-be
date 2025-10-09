import type { Request, Response } from "express";
import { UserService } from "./user.service.js";

export const UserController = {
  async create(req: Request, res: Response) {
    const data = req.body;

    await UserService.createUser(data);

    res.json({ message: "User created successfully" });
  },
};
