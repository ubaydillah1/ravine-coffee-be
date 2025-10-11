import type { Request, Response } from "express";
import { PaymentMethod, Prisma } from "@prisma/client";
import { MidtransService } from "./midtrans.service.js";
import { randomBytes } from "crypto";
import { PaymentWebhookService } from "./webhook.service.js";

export const PaymentService = {
  async webhook(req: Request, res: Response) {
    const result = await PaymentWebhookService.handleWebhook(req.body);
    res.status(200).json({ message: "Webhook received", result });
  },

  async handlePayment(method: PaymentMethod, totalAmount: Prisma.Decimal) {
    switch (method) {
      case PaymentMethod.QRIS: {
        const midtransOrder = await MidtransService.createQrisPayment(
          totalAmount.toNumber()
        );

        return {
          qrisUrl: midtransOrder.actions?.[0]?.url ?? null,
          midtransOrderId: midtransOrder.order_id,
          internalQrCode: null,
        };
      }

      case PaymentMethod.CASH: {
        const internalQrCode = randomBytes(4).toString("hex");
        return {
          qrisUrl: null,
          midtransOrderId: null,
          internalQrCode,
        };
      }

      default:
        throw new Error(`Unsupported payment method: ${method}`);
    }
  },
};
