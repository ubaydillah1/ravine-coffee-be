import type { Request, Response } from "express";
import { PaymentWebhookService } from "./services/webhook.service.js";

export const PaymentController = {
  async webhook(req: Request, res: Response) {
    try {
      await PaymentWebhookService.handleWebhook(req.body);

      res.status(200).json({ message: "Webhook received" });
    } catch (err) {
      console.error("❌ Webhook error:", (err as Error).message);

      res.status(200).json({
        message: "Webhook received (ignored error)",
        error: (err as Error).message,
      });
    }
  },

  async simulatePaymentStatus(req: Request, res: Response) {
    const orderId = req.params.orderId as string;

    await PaymentWebhookService.simulatePaymentStatus(orderId);

    res.status(200).json({ message: "Payment status simulated" });
  },
};
