import {
  subDays,
  subWeeks,
  subMonths,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
} from "date-fns";
import type { Period } from "../../types/table.js";
import { OverviewRepository } from "./overview.repository.js";
import type { RevenuePeriod } from "../../helpers/date-range.js";

function calculateGrowth(current: number, previous: number): number {
  if (previous === 0) return 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

export const OverviewService = {
  async getDashboardOverview(period: Period = "today") {
    const today = new Date();
    let start: Date, end: Date;
    let prevStart: Date, prevEnd: Date;

    switch (period) {
      case "today":
        start = startOfDay(today);
        end = endOfDay(today);
        prevStart = startOfDay(subDays(today, 1));
        prevEnd = endOfDay(subDays(today, 1));
        break;
      case "this-week":
        start = startOfWeek(today, { weekStartsOn: 1 });
        end = endOfWeek(today, { weekStartsOn: 1 });
        prevStart = subWeeks(start, 1);
        prevEnd = subWeeks(end, 1);
        break;
      case "this-month":
        start = startOfMonth(today);
        end = endOfMonth(today);
        prevStart = startOfMonth(subMonths(today, 1));
        prevEnd = endOfMonth(subMonths(today, 1));
        break;
      default:
        start = startOfDay(today);
        end = endOfDay(today);
        prevStart = startOfDay(subDays(today, 1));
        prevEnd = endOfDay(subDays(today, 1));
    }

    const current = await OverviewRepository.getSummary(period, start, end);
    const previous = await OverviewRepository.getSummary(
      period,
      prevStart,
      prevEnd
    );

    return {
      totalRevenue: current.totalRevenue,
      totalOrders: current.totalOrders,
      averageExpenses: current.averageExpenses,
      averageRevenue: current.averageRevenue,
      growth: {
        totalRevenue: calculateGrowth(
          current.totalRevenue,
          previous.totalRevenue
        ),
        totalOrders: calculateGrowth(current.totalOrders, previous.totalOrders),
        averageExpenses: calculateGrowth(
          current.averageExpenses,
          previous.averageExpenses
        ),
        averageRevenue: calculateGrowth(
          current.averageRevenue,
          previous.averageRevenue
        ),
      },
    };
  },

  async getSummary(period: Period = "today") {
    return await OverviewRepository.getSummary(period);
  },

  async getRevenueChart(period: RevenuePeriod = "weekly") {
    return await OverviewRepository.getRevenueChart(period);
  },

  async getOrderTypes(period: Period = "today") {
    return await OverviewRepository.getOrderTypes(period);
  },

  async getPaymentMethods(period: Period = "today") {
    return await OverviewRepository.getPaymentMethods(period);
  },

  async getCategorySales(period: Period = "today") {
    return await OverviewRepository.getCategorySales(period);
  },

  async getTodayCompletedOrders() {
    return await OverviewRepository.getTodayCompletedOrders();
  },
};
