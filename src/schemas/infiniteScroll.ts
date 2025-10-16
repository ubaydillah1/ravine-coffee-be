import { z } from "zod";

export const InfiniteScrollScheme = z.object({
  limit: z
    .string()
    .transform((val) => parseInt(val))
    .refine((val) => !isNaN(val) && val > 0, "Limit must be a positive number")
    .default(12),
  cursor: z.string().optional(),
});

export type InfiniteScrollScheme = z.infer<typeof InfiniteScrollScheme>;
