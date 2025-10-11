import type { Request, Response } from "express";
import { OrderService } from "./order.service.js";

export const OrderController = {
  async create(req: Request, res: Response) {
    const data = req.body;

    const result = await OrderService.create(data);

    const response = {
      message: "Order created successfully",
      data: {
        order: result.order,
        payment: {
          method: result.order.paymentMethod,
          qrisUrl: result.qrisUrl ?? null,
          internalQrCode: result.internalQrCode ?? null,
        },
      },
    };

    res.status(201).json(response);
  },
};
