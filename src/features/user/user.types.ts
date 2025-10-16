import type { z } from "zod";
import type { CashierSchema } from "./user.scheme.js";
import type { InfiniteScrollScheme } from "../../schemas/infiniteScroll.js";

export type CashierType = z.infer<typeof CashierSchema>;
export type CashierQueryType = z.infer<typeof InfiniteScrollScheme>;
