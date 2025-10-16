import prisma from "../../lib/prisma.js";
import type { HistoryQueryScheme, HistoryScheme } from "./history.types.js";

export const HistoryRepository = {
  async getHistory({ limit = 20, cursor }: HistoryQueryScheme) {
    const history = await prisma.orderHistory.findMany({
      take: limit,
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
      orderBy: { createdAt: "desc" },
    });

    let nextCursor = null;

    if (history.length > limit) nextCursor = history.pop()?.id;

    return { history, nextCursor };
  },

  async createHistory(data: HistoryScheme) {
    return await prisma.orderHistory.create({ data });
  },
};
