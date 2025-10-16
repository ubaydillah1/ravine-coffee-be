import type { Request, Response } from "express";
import { OverviewService } from "./overview.service.js";
import type { Period } from "../../types/table.js";

export const OverviewController = {
  async getOverview(req: Request, res: Response) {
    const period = (req.query.period as Period) || "today";

    console.log(period);

    const data = await OverviewService.getDashboardOverview(period);

    res.json({ message: "Overview fetched successfully", result: data });
  },

  async getTodayCompletedOrders(_: Request, res: Response) {
    const data = await OverviewService.getTodayCompletedOrders();

    res.json({ message: "Orders fetched successfully", result: data });
  },
};
