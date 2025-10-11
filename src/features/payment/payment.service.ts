import type { Request, Response } from "express";
import { OrderRepository } from "../order/order.repository.js";
import { PaymentStatus } from "@prisma/client";

export const PaymentService = {
  async webhook(req: Request, res: Response) {
    const result = await PaymentService.handleWebhook(req.body);
    res.status(200).json({ message: "Webhook received", result });
  },

  async handleWebhook(notification: any) {
    const { order_id, transaction_status } = notification;

    const order = await OrderRepository.getOrderByMidtransId(order_id);
    if (!order) throw new Error("Order not found");

    let newStatus = order.paymentStatus;

    if (
      transaction_status === "capture" ||
      transaction_status === "settlement"
    ) {
      newStatus = PaymentStatus.SUCCESS;
    } else if (transaction_status === "pending") {
      newStatus = PaymentStatus.PENDING;
    } else if (
      transaction_status === "cancel" ||
      transaction_status === "deny" ||
      transaction_status === "expire"
    ) {
      newStatus = PaymentStatus.CANCELLED;
    }

    await OrderRepository.updatePaymentStatus(order.id, newStatus);

    return { orderId: order.id, newStatus };
  },
};
