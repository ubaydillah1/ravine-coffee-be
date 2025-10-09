import { z } from "zod";

export const CashierScheme = z.object({
  fullName: z.string().min(3, "Full name is required"),
  email: z.string().email(),
  role: z.enum(["ADMIN", "CASHIER", "USER"]).default("CASHIER"),
  dateOfBirth: z.date().nullable().default(null),
  city: z.string().nullable().default(null),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
