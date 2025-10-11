import type { Request, Response } from "express";
import { OrderService } from "./order.service.js";

export const OrderController = {
  async createOrder(req: Request, res: Response) {
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

    res
      .status(201)
      .json({ message: "Order created successfully", result: response });
  },

  async getOrders(req: Request, res: Response) {
    const limit = parseInt(req.query.limit as string) || 10;
    const cursor = req.body.cursor as string | undefined;

    const result = await OrderService.getOrders(limit, cursor);

    res.status(200).json({ message: "Orders fetched successfully", result });
  },

  async getSingleOrder(req: Request, res: Response) {
    const { id } = req.params as { id: string };

    const result = await OrderService.getOrderById(id);

    res.status(200).json({ message: "Order fetched successfully", result });
  },
};
