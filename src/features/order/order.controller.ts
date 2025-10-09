import type { Request, Response } from "express";
import { OrderService } from "./order.service.js";

export const OrderController = {
  async create(req: Request, res: Response) {
    const data = req.body;

    await OrderService.create(data);

    res.status(201).json({ message: "Order created successfully" });
  },
};
