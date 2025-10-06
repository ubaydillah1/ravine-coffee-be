import { Prisma } from "@prisma/client";
import prisma from "../../lib/prisma.js";

export const OrderRepository = {
  findProducts(ids: string[]) {
    return prisma.product.findMany({
      where: { id: { in: ids } },
    });
  },

  createOrder(data: Prisma.OrderUncheckedCreateInput) {
    return prisma.order.create({
      data,
      include: { OrderItem: true },
    });
  },

  createHistory(data: Prisma.OrderHistoryUncheckedCreateInput) {
    return prisma.orderHistory.create({ data });
  },
};
