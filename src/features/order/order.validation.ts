import { OrderType, PaymentMethod } from "@prisma/client";
import { z } from "zod";

export const createOrderSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.email("Invalid email"),
  phoneNumber: z
    .string()
    .regex(/^(?:\+62|62|0)[2-9][0-9]{7,11}$/, "Invalid phone number format")
    .optional(),
  tableNumber: z.number().min(1, "Table number must be at least 1"),
  orderType: z.enum(OrderType),
  paymentMethod: z.enum(PaymentMethod),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive("Quantity must be positive"),
      })
    )
    .min(1, "Order must contain at least one item"),
});
