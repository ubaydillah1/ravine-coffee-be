import type { z } from "zod";
import type { CashierScheme } from "./user.scheme.js";

export type CashierInput = z.infer<typeof CashierScheme>;
