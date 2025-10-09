import z from "zod";
import type { productScheme } from "./product.scheme.js";

export type ProductScheme = z.infer<typeof productScheme>;
