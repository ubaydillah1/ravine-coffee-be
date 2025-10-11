import z from "zod";
import type { ProductScheme, ProductsQuerySchema } from "./product.scheme.js";

export type ProductScheme = z.infer<typeof ProductScheme>;
export type ProductsQuerySchema = z.infer<typeof ProductsQuerySchema>;
