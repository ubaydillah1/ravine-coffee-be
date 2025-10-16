import { endOfDay, endOfMonth, startOfDay, startOfMonth, subDays } from "date-fns";
import type { Period } from "../types/table.js";

export const getDateRange = (period: Period): { gte: Date; lte: Date } => {
  const today = new Date();

  switch (period) {
    case "today":
      return { gte: startOfDay(today), lte: endOfDay(today) };
    case "weekly":
      return { gte: subDays(today, 7), lte: today };
    case "monthly":
      return { gte: startOfMonth(today), lte: endOfMonth(today) };
    default:
      return { gte: subDays(today, 7), lte: today };
  }
};
