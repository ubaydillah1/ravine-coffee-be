import { ProductCategory } from "@prisma/client";
import z from "zod";
import { PaginationSchema } from "../../schemas/pagination.js";

export const ProductScheme = z.object({
  name: z.string().min(3, "Product name is required"),
  description: z.string().optional(),
  price: z.coerce.number().min(1, "Product price is required"),
  category: z.enum(ProductCategory).default("COFFEE"),
});

export const ProductsQuerySchema = PaginationSchema.extend({
  category: z
    .string()
    .toUpperCase()
    .refine(
      (val) => Object.values(ProductCategory).includes(val as ProductCategory),
      `Category must be one of: ${Object.values(ProductCategory)
        .join(", ")
        .toLowerCase()}`
    )
    .transform((val) => val as ProductCategory)
    .optional(),
});
