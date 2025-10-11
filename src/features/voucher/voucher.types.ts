import type z from "zod";
import type { VoucherQuerySchema, VoucherScheme } from "./voucher.scheme.js";

export type VoucherInput = z.infer<typeof VoucherScheme>;
export type VoucherQuerySchema = z.infer<typeof VoucherQuerySchema>;
