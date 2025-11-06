import {
  OrderChannel,
  OrderStatus,
  OrderType,
  PaymentMethod,
} from "@prisma/client";
import { z } from "zod";
import { InfiniteScrollScheme } from "../../schemas/infiniteScroll.js";

export const CheckoutSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  email: z.email("Invalid email"),
  phoneNumber: z
    .string()
    .regex(/^(?:\+62|62|0)[2-9][0-9]{7,11}$/, "Invalid phone number format")
    .optional(),
  tableNumber: z.string().min(1, "Table number is required").optional(),
  voucherCode: z.string().optional(),
  orderType: z.enum(OrderType),
  taxRate: z.coerce.number().min(0, "Tax rate must be non-negative").optional(),
  paymentMethod: z.enum(PaymentMethod),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive("Quantity must be positive"),
      })
    )
    .min(1, "Order must contain at least one item"),
  cashierId: z.string().optional(),
  orderChannel: z.enum(OrderChannel),
});

export const StatusOrderScheme = z.object({
  status: z
    .string()
    .toUpperCase()
    .refine((val) => val in OrderStatus, {
      message: `Status must be one of: ${Object.values(OrderStatus)
        .join(", ")
        .toLowerCase()}`,
    }),
});

export const OrdersQuerySchema = InfiniteScrollScheme.extend({
  status: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        const trimmed = val.trim();
        return trimmed === "" ? undefined : trimmed;
      }

      return undefined;
    },
    z
      .string()
      .toUpperCase()
      .refine(
        (val) => Object.values(OrderStatus).includes(val as OrderStatus),
        `Status must be one of: ${Object.values(OrderStatus)
          .join(", ")
          .toLowerCase()}`
      )
      .transform((val) => val as OrderStatus)
      .optional()
  ),
  orderDate: z.preprocess((val) => {
    if (val === "" || val === null || val === undefined) {
      return undefined;
    }

    if (typeof val === "string" || val instanceof Date) {
      const date = new Date(val);
      return date;
    }

    return val;
  }, z.date().max(new Date(), { message: "Order date cannot be in the future" }).optional()),

  search: z.preprocess((val) => {
    if (typeof val === "string") {
      const trimmed = val.trim();

      return trimmed === "" ? undefined : trimmed;
    }

    return undefined;
  }, z.string().optional()),
});
