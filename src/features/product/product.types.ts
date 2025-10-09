import z from "zod";
import type { createProductScheme } from "./product.scheme.js";

export type CreateProductScheme = z.infer<typeof createProductScheme>;
