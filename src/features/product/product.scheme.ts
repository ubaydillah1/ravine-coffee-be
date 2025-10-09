import { ProductCategory } from "@prisma/client";
import z from "zod";

export const createProductScheme = z.object({
  name: z.string().min(3, "Product name is required"),
  description: z.string().optional(),
  price: z.coerce.number().min(1, "Product price is required"),
  category: z.enum(ProductCategory).default("COFFEE"),
});
