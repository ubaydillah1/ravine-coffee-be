import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subDays,
  subMonths,
  subYears,
  format,
} from "date-fns";
import type { Period } from "../types/table.js";

export const getDateRange = (period: Period): { gte: Date; lte: Date } => {
  const today = new Date();

  switch (period) {
    case "today":
      return { gte: startOfDay(today), lte: endOfDay(today) };

    case "this-week":
      return {
        gte: startOfWeek(today, { weekStartsOn: 1 }),
        lte: endOfWeek(today, { weekStartsOn: 1 }),
      };

    case "this-month":
      return { gte: startOfMonth(today), lte: endOfMonth(today) };

    default:
      return { gte: subDays(today, 7), lte: endOfDay(today) };
  }
};

export type RevenuePeriod = "weekly" | "monthly" | "annual";

function getRange(period: RevenuePeriod) {
  const now = new Date();

  switch (period) {
    case "weekly":
      return {
        from: startOfWeek(subMonths(now, 3), { weekStartsOn: 1 }),
        to: endOfWeek(now, { weekStartsOn: 1 }),
      };

    case "monthly":
      return {
        from: startOfMonth(subYears(now, 1)),
        to: endOfMonth(now),
      };

    case "annual":
      return {
        from: startOfYear(subYears(now, 5)),
        to: endOfYear(now),
      };
  }
}

function formatKey(date: Date, period: RevenuePeriod) {
  switch (period) {
    case "weekly":
      return format(date, "yyyy-'W'II");
    case "monthly":
      return format(date, "yyyy-MM");
    case "annual":
      return format(date, "yyyy");
  }
}

export const RevenueRangeHelper = {
  getRange,
  formatKey,
};
