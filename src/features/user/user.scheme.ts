import { UserRole } from "@prisma/client";
import { z } from "zod";

export const CashierSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  phoneNumber: z
    .string()
    .min(8, "Phone number is required")
    .nullable()
    .default(null),
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  city: z.string().nullable().default(null),
  dateOfBirth: z.date().nullable().default(null),
  role: z.enum(UserRole).default(UserRole.CASHIER),
});
