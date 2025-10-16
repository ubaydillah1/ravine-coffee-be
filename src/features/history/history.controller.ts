import type { Request, Response } from "express";
import { HistoryService } from "./history.service.js";

export const HistoryContoller = {
  async getHistory(req: Request, res: Response) {
    const limit = parseInt(req.query.limit as string) || 10;
    const cursor = (req.query.cursor as string) || undefined;

    const history = await HistoryService.getHistory({ limit, cursor });
    res.json({ message: "History fetched successfully", result: history });
  },

  async createHistory(req: Request, res: Response) {
    const data = req.body;
    const history = await HistoryService.createHistory(data);
    res.json({ message: "History created successfully", result: history });
  },
};
