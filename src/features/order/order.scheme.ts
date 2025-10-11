import { OrderType, PaymentMethod } from "@prisma/client";
import { z } from "zod";

export const CheckoutSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  email: z.email("Invalid email"),
  phoneNumber: z
    .string()
    .regex(/^(?:\+62|62|0)[2-9][0-9]{7,11}$/, "Invalid phone number format"),
  tableNumber: z.string().min(1, "Table number is required"),

  orderType: z.enum(OrderType),
  discount: z.coerce
    .number()
    .min(0, "Discount must be non-negative")
    .optional(),

  taxRate: z.coerce.number().min(0, "Tax rate must be non-negative").optional(),
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
