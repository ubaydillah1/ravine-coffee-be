import { Prisma } from "@prisma/client";
import prisma from "../../lib/prisma.js";

export const OrderRepository = {
  createOrder(data: Prisma.OrderUncheckedCreateInput) {
    return prisma.order.create({
      data,
      include: { OrderItem: true },
    });
  },
};
