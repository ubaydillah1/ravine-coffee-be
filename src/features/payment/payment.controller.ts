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
};
