import { OrderStatus } from "@prisma/client";
import z from "zod";

export const HistoryInputScheme = z.object({
  orderId: z.string(),
  orderStatus: z.enum(OrderStatus).default(OrderStatus.INPROGRESS),
});
