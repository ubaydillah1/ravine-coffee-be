import type { z } from "zod";
import type { CashierSchema } from "./user.scheme.js";

export type CashierType = z.infer<typeof CashierSchema>;
