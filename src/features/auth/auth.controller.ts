import type { Request, Response } from "express";
import { AuthService } from "./auth.service.js";

export const AuthContoller = {
  async login(req: Request, res: Response) {
    const data = req.body;

    const { token } = await AuthService.login(data);

    res.json({ message: "Login successful", token });
  },
};
