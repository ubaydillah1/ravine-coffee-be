import { z } from "zod";
import { PERIOD_VALUES, type Period } from "../../types/table.js";

export const OverviewQuerySchema = z.object({
  period: z
    .string()
    .transform((val) => val?.toLowerCase().trim())
    .transform((val) => (val === "" ? undefined : val))
    .refine(
      (val): val is Period | undefined =>
        !val || PERIOD_VALUES.includes(val as Period),
      {
        message: `Period must be one of: ${PERIOD_VALUES.join(", ")}`,
      }
    )
    .default("today")
    .nullable(),
});
