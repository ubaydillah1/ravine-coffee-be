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
      custom_expiry: {
        order_time: formatMidtransTime(),
        expiry_duration: 5,
        unit: "minute",
      },
    });

    if (!midtransOrder.actions?.[0]?.url) {
      throw new BadRequestError("Failed to create QRIS transaction");
    }

    return midtransOrder;
  },
};

function formatMidtransTime(date = new Date()) {
  const pad = (n: number) => n.toString().padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  const offset = -date.getTimezoneOffset();
  const sign = offset >= 0 ? "+" : "-";
  const offsetHours = pad(Math.floor(Math.abs(offset) / 60));
  const offsetMinutes = pad(Math.abs(offset) % 60);

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${sign}${offsetHours}${offsetMinutes}`;
}
