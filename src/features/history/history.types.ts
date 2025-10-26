import z from "zod";
import type {
  HistoryInputScheme,
  HistoryQueryScheme,
} from "./history.scheme.js";

export type HistoryScheme = z.infer<typeof HistoryInputScheme>;
export type HistoryQueryScheme = z.infer<typeof HistoryQueryScheme>;
