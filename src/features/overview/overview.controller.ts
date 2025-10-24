import type { Request, Response } from "express";
import { OverviewService } from "./overview.service.js";
import type { Period } from "../../types/table.js";
import type { RevenuePeriod } from "../../helpers/date-range.js";

export const OverviewController = {
  async getOverview(req: Request, res: Response) {
    const period = (req.query.period as Period) || "today";
    const data = await OverviewService.getDashboardOverview(period);
    res.json({ message: "Overview fetched successfully", result: data });
  },

  async getSummary(req: Request, res: Response) {
    const period = (req.query.period as Period) || "today";
    const data = await OverviewService.getSummary(period);
    res.json({ message: "Summary fetched successfully", result: data });
  },

  async getRevenueChart(req: Request, res: Response) {
    const period = (req.query.period as RevenuePeriod) || "weekly";
    const data = await OverviewService.getRevenueChart(period);
    res.json({ message: "Revenue chart fetched successfully", result: data });
  },

  async getOrderTypes(req: Request, res: Response) {
    const period = (req.query.period as Period) || "today";
    const data = await OverviewService.getOrderTypes(period);
    res.json({ message: "Order types fetched successfully", result: data });
  },

  async getPaymentMethods(req: Request, res: Response) {
    const period = (req.query.period as Period) || "today";
    const data = await OverviewService.getPaymentMethods(period);
    res.json({ message: "Payment methods fetched successfully", result: data });
  },

  async getCategorySales(req: Request, res: Response) {
    const period = (req.query.period as Period) || "today";
    const data = await OverviewService.getCategorySales(period);
    res.json({ message: "Category sales fetched successfully", result: data });
  },

  async getTodayCompletedOrders(_: Request, res: Response) {
    const data = await OverviewService.getTodayCompletedOrders();
    res.json({
      message: "Today's completed orders fetched successfully",
      result: data,
    });
  },
};
