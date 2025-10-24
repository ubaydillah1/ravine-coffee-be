export const PERIOD_VALUES = ["today", "this-week", "this-month"] as const;
export type Period = (typeof PERIOD_VALUES)[number];
