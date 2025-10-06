import type { Request, Response } from "express";
import { OrderService } from "./order.service.js";
import { AppError } from "../../utils/errors.js";

export const OrderController = {
  async create(req: Request, res: Response) {
    try {
      const { userId, items, tableNumber, orderType, paymentMethod } = req.body;

      const order = await OrderService.create({
        userId,
        items,
        tableNumber,
        orderType,
        paymentMethod,
      });

      res.status(201).json({ message: "Order created successfully", order });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: (error as Error).message });
    }
  },
};
