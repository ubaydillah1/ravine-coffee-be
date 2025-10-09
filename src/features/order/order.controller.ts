import type { Request, Response } from "express";
import { OrderService } from "./order.service.js";

export const OrderController = {
  async create(req: Request, res: Response) {
    const { userId, items, tableNumber, orderType, paymentMethod } = req.body;

    await OrderService.create({
      userId,
      items,
      tableNumber,
      orderType,
      paymentMethod,
    });

    res.status(201).json({ message: "Order created successfully" });
  },
};
