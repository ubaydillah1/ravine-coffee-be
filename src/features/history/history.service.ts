import { HistoryRepository } from "./history.repository.js";
import type { HistoryQueryScheme, HistoryScheme } from "./history.types.js";

export const HistoryService = {
  async getHistory({ limit, cursor }: HistoryQueryScheme) {
    return await HistoryRepository.getHistory({ limit, cursor });
  },

  async createHistory(data: HistoryScheme) {
    return await HistoryRepository.createHistory(data);
  },
};
