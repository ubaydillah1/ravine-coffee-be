import z from "zod";
import type { HistoryInputScheme } from "./history.scheme.js";
import type { InfiniteScrollScheme } from "../../schemas/infiniteScroll.js";

export type HistoryScheme = z.infer<typeof HistoryInputScheme>;
export type HistoryQueryScheme = z.infer<typeof InfiniteScrollScheme>;
