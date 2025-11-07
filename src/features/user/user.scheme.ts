import { UserRole, UserStatus } from "@prisma/client";
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

export const ChangeStatusSchema = z.object({
  status: z.enum(UserStatus),
});

export const ProfileUpdateScheme = z.object({
  fullName: z.string().min(3, "Full name is required"),
  phoneNumber: z
    .string()
    .regex(/^(?:\+62|62|0)[2-9][0-9]{7,11}$/, "Invalid phone number format")
    .optional(),
  city: z.string(),
  dateOfBirth: z.preprocess((val) => {
    if (typeof val === "string" && val.trim() !== "") {
      return new Date(val);
    }
    return null;
  }, z.date().nullable().default(null)),
});
