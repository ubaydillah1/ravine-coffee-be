import type { Request, Response } from "express";
import { HistoryService } from "./history.service.js";
import type { OrderStatus } from "@prisma/client";

export const HistoryContoller = {
  async getHistory(req: Request, res: Response) {
    const limit = parseInt(req.query.limit as string) || 10;
    const cursor = (req.query.cursor as string) || undefined;
    const date = (req.query.date as string) || undefined;
    const status = req.query.status
      ? (req.query.status as OrderStatus).toUpperCase()
      : undefined;

    const history = await HistoryService.getHistory({
      limit,
      cursor,
      date,
      status,
    });

    res.json({ message: "History fetched successfully", result: history });
  },

  async createHistory(req: Request, res: Response) {
    const data = req.body;
    const history = await HistoryService.createHistory(data);
    res.json({ message: "History created successfully", result: history });
  },

  async getSummary(_: Request, res: Response) {
    const data = await HistoryService.getSummary();
    res.json({ message: "Summary fetched successfully", result: data });
  },
};
