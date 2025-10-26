import { HistoryRepository } from "./history.repository.js";
import type { HistoryQueryScheme, HistoryScheme } from "./history.types.js";

export const HistoryService = {
  async getHistory({ limit, cursor, date, status }: HistoryQueryScheme) {
    return await HistoryRepository.getHistory({ limit, cursor, date, status });
  },

  async createHistory(data: HistoryScheme) {
    return await HistoryRepository.createHistory(data);
  },

  async getSummary() {
    return await HistoryRepository.getSummary();
  },
};
