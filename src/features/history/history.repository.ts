import prisma from "../../lib/prisma.js";
import type { HistoryQueryScheme, HistoryScheme } from "./history.types.js";

export const HistoryRepository = {
  async getHistory({ limit = 20, cursor }: HistoryQueryScheme) {
    const history = await prisma.orderHistory.findMany({
      take: limit,
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
      orderBy: { createdAt: "desc" },
      select: {
        orderStatus: true,
        id: true,
        Order: {
          select: {
            id: true,
            tableNumber: true,
            totalAmount: true,
            Customer: {
              select: {
                fullName: true,
              },
            },
          },
        },
      },
    });

    let nextCursor = null;

    if (history.length > limit) nextCursor = history.pop()?.id;

    return { history, nextCursor };
  },

  async getSingleHistory(id: string) {
    return await prisma.orderHistory.findUnique({
      where: { id },
      select: {
        orderStatus: true,
        id: true,
        Order: {
          select: {
            id: true,
            orderType: true,
            paymentMethod: true,
            notes: true,
            subTotalAmount: true,
            taxAmount: true,
            totalAmount: true,
            Voucher: {
              select: {
                code: true,
              },
            },
            tableNumber: true,
            createdAt: true,
            Cashier: {
              select: {
                fullName: true,
              },
            },
            Customer: {
              select: {
                fullName: true,
                phoneNumber: true,
              },
            },
            OrderItem: {
              select: {
                quantity: true,
                subtotal: true,
                productName: true,
                productImage: true,
                productPrice: true,
              },
            },
          },
        },
      },
    });
  },

  async createHistory(data: HistoryScheme) {
    return await prisma.orderHistory.create({ data });
  },
};
