import midtransCore from "../../../lib/midtrans.js";
import type { MidtransQrisResponse } from "../../../types/midtrans.js";
import { BadRequestError } from "../../../utils/errors.js";
import { randomUUID } from "crypto";

export const MidtransService = {
  async createQrisPayment(amount: number): Promise<MidtransQrisResponse> {
    const midtransOrder: MidtransQrisResponse = await midtransCore.charge({
      payment_type: "qris",
      transaction_details: {
        order_id: randomUUID(),
        gross_amount: amount,
      },
      qris: { acquirer: "gopay" },
    });

    if (!midtransOrder.actions?.[0]?.url) {
      throw new BadRequestError("Failed to create QRIS transaction");
    }

    return midtransOrder;
  },
};
