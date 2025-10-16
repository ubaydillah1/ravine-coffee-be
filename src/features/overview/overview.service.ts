import { subDays, subMonths } from "date-fns";
import type { Period } from "../../types/table.js";
import { OverviewRepository } from "./overview.repository.js";

function calculateGrowth(current: number, previous: number): number {
  if (previous === 0) return 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

export const OverviewService = {
  async getDashboardOverview(period: Period = "today") {
    // Ambil data periode sekarang
    const current = await OverviewRepository.getSummary(period);

    // Tentukan periode sebelumnya
    let prevStart: Date, prevEnd: Date;

    const today = new Date();
    switch (period) {
      case "today":
        prevStart = subDays(today, 1);
        prevEnd = subDays(today, 1);
        break;
      case "weekly":
        prevStart = subDays(today, 14);
        prevEnd = subDays(today, 7);
        break;
      case "monthly":
        prevStart = subMonths(today, 2);
        prevEnd = subMonths(today, 1);
        break;
      default:
        prevStart = subDays(today, 1);
        prevEnd = subDays(today, 1);
    }

    const previous = await OverviewRepository.getSummary(
      period,
      prevStart,
      prevEnd
    );

    const summaryWithGrowth = {
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

    return summaryWithGrowth;
  },

  async getTodayCompletedOrders() {
    return await OverviewRepository.getTodayCompletedOrders();
  },
};
