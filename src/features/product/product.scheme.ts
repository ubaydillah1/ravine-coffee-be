import { ProductCategory } from "@prisma/client";
import z from "zod";

export const productScheme = z.object({
  name: z.string().min(3, "Product name is required"),
  description: z.string().optional(),
  price: z.coerce.number().min(1, "Product price is required"),
  category: z.enum(ProductCategory).default("COFFEE"),
});

export const getAllProductsQuerySchema = z.object({
  limit: z
    .string()
    .transform((val) => parseInt(val))
    .refine((val) => !isNaN(val) && val > 0, "Limit must be a positive number")
    .optional()
    .default(12),

  offset: z
    .string()
    .transform((val) => parseInt(val))
    .refine(
      (val) => !isNaN(val) && val >= 0,
      "Offset must be a non-negative number"
    )
    .optional()
    .default(0),

  category: z
    .string()
    .transform((val) => val.toUpperCase())
    .refine(
      (val) => Object.values(ProductCategory).includes(val as ProductCategory),
      `Category must be one of: ${Object.values(ProductCategory).join(", ")}`
    )
    .optional(),
});
