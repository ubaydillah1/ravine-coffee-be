import { z } from "zod";
import { PaginationSchema } from "../../schemas/pagination.js";
import { VoucherStatus } from "@prisma/client";

export const VoucherScheme = z
  .object({
    name: z.string().min(3, "Voucher name is required"),
    code: z
      .string()
      .min(3, "Voucher code is required")
      .max(10, "Voucher code is too long"),
    discountValue: z.coerce.number().min(1, "Discount is required"),
    minimumAmount: z.coerce.number().min(1, "Minimum amount is required"),
    maximumAmount: z.coerce.number().min(1, "Maximum amount is required"),
    startDate: z.coerce
      .date()
      .min(new Date(), "Start date must be in the future"),
    endDate: z.coerce.date().min(new Date(), "End date must be in the future"),
    description: z
      .string()
      .min(3, "Description is required")
      .nullable()
      .default(null),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export const VoucherQuerySchema = PaginationSchema.extend({
  status: z
    .string()
    .toUpperCase()
    .refine(
      (val) => Object.values(VoucherStatus).includes(val as VoucherStatus),
      `Voucher must be one of: ${Object.values(VoucherStatus).join(", ")}`
    )
    .transform((val) => val as VoucherStatus)
    .optional(),
});
