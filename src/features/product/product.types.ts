import z from "zod";
import type { ProductScheme } from "./product.scheme.js";

export type ProductScheme = z.infer<typeof ProductScheme>;
