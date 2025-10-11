import type { Request, Response } from "express";
import { UserService } from "./user.service.js";

export const UserController = {
  async createCashier(req: Request, res: Response) {
    const data = req.body;
    const file = req.file as Express.Multer.File;

    const cashier = await UserService.createCashier(data, file);

    res
      .status(201)
      .json({ message: "Cashier created successfully", result: cashier });
  },

  async getAllCashiers(req: Request, res: Response) {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    const cashiers = await UserService.getAllCashiers(limit, offset);
    res
      .status(200)
      .json({ message: "Cashiers fetched successfully", result: cashiers });
  },

  async getCashierById(req: Request, res: Response) {
    const { id } = req.params as { id: string };
    const cashier = await UserService.getCashierById(id);
    res
      .status(200)
      .json({ message: "Cashier fetched successfully", result: cashier });
  },

  async deleteCashier(req: Request, res: Response) {
    const { id } = req.params as { id: string };
    const cashier = await UserService.deleteCashier(id);
    res
      .status(200)
      .json({ message: "Cashier deleted successfully", result: cashier });
  },

  async updateCashier(req: Request, res: Response) {
    const { id } = req.params as { id: string };
    const data = req.body;
    const file = req.file as Express.Multer.File;

    const cashier = await UserService.updateCashier(id, data, file);

    res
      .status(200)
      .json({ message: "Cashier updated successfully", result: cashier });
  },
};
