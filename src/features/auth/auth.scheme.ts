import { z } from "zod";

export const LoginScheme = z.object({
  email: z.email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const RegisterScheme = z.object({
  fullName: z.string().min(3, "Full name is required"),
  phoneNumber: z
    .string()
    .regex(/^(?:\+62|62|0)[2-9][0-9]{7,11}$/, "Invalid phone number format"),
  email: z.email(),
});
