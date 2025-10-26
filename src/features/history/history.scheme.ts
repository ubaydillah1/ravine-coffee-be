import { OrderStatus } from "@prisma/client";
import z from "zod";
import { InfiniteScrollScheme } from "../../schemas/infiniteScroll.js";

export const HistoryInputScheme = z.object({
  orderId: z.string(),
  orderStatus: z.enum(OrderStatus).default(OrderStatus.INPROGRESS),
});

export const HistoryQueryScheme = InfiniteScrollScheme.extend({
  date: z.string().optional(),
  status: z
    .string()
    .transform((val) => (val === "" ? undefined : val.toUpperCase()))
    .refine(
      (val) =>
        val === undefined ||
        Object.values(OrderStatus).includes(val as OrderStatus),
      { message: "Invalid order status" }
    )
    .optional(),
});
