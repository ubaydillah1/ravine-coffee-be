import type { Request, Response } from "express";
import { OrderChannel, PaymentMethod, Prisma } from "@prisma/client";
import { MidtransService } from "./midtrans.service.js";
import { randomBytes } from "crypto";
import { PaymentWebhookService } from "./webhook.service.js";
import { BadRequestError } from "../../../utils/errors.js";

export const PaymentService = {
  async webhook(req: Request, res: Response) {
    const result = await PaymentWebhookService.handleWebhook(req.body);
    res.status(200).json({ message: "Webhook received", result });
  },

  async handlePayment(
    method: PaymentMethod,
    totalAmount: Prisma.Decimal,
    OrderChannel: OrderChannel
  ) {
    const tenMinuesFromNow = new Date(Date.now() + 10 * 60 * 1000);

    switch (method) {
      case PaymentMethod.QRIS: {
        const midtransOrder = await MidtransService.createQrisPayment(
          totalAmount.toNumber()
        );

        return {
          qrisMidtransUrl: midtransOrder.actions?.[0]?.url ?? null,
          midtransOrderId: midtransOrder.order_id,
          internalQrCode: null,
          expiredQrisMidtransUrl: midtransOrder.expiry_time
            ? new Date(midtransOrder.expiry_time.replace(" ", "T") + "+07:00")
            : null,
        };
      }

      case PaymentMethod.CASH: {
        if (OrderChannel === "ONLINE") {
          const code = randomBytes(4).toString("hex");

          return {
            qrisMidtransUrl: null,
            midtransOrderId: null,
            internalQrCode: code,
            expiredInternalQrCode: tenMinuesFromNow,
          };
        } else {
          return {
            qrisMidtransUrl: null,
            midtransOrderId: null,
            internalQrCode: null,
            expiredInternalQrCode: null,
          };
        }
      }

      default:
        throw new BadRequestError(`Unsupported payment method: ${method}`);
    }
  },
};
