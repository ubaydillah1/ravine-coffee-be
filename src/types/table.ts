export const PERIOD_VALUES = ["today", "weekly", "monthly"] as const;
export type Period = (typeof PERIOD_VALUES)[number];
