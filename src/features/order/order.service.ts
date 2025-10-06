import { Prisma } from "@prisma/client";
import prisma from "../../lib/prisma.js";
import { NotFoundError, BadRequestError } from "../../utils/errors.js";
import type { CreateOrderParams } from "./order.types.js";

export const OrderService = {
  async create({
    userId,
    items,
    tableNumber,
    orderType,
    paymentMethod,
  }: CreateOrderParams) {
    return prisma.$transaction(async (tx) => {
      if (!items || items.length === 0)
        throw new BadRequestError("Order must contain items");

      const productIds = items.map((i) => i.productId);
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
      });

      if (products.length !== items.length)
        throw new NotFoundError("Some products not found");

      const orderItemsData = items.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product)
          throw new NotFoundError(`Product ${item.productId} not found`);

        const price = new Prisma.Decimal(product.price || 0);
        const qty = new Prisma.Decimal(item.quantity || 1);
        const subtotal = price.mul(qty);

        return {
          productId: item.productId,
          quantity: qty.toNumber(),
          price,
          subtotal,
        };
      });

      const totalAmount = orderItemsData.reduce(
        (acc, i) => acc.add(i.subtotal),
        new Prisma.Decimal(0)
      );

      const order = await tx.order.create({
        data: {
          tableNumber,
          customerId: userId,
          totalAmount,
          orderType,
          paymentStatus: "PENDING",
          paymentMethod,
          OrderItem: { createMany: { data: orderItemsData } },
        },
        include: { OrderItem: true },
      });

      await tx.orderHistory.create({
        data: {
          orderId: order.id,
          status: "OPEN_BILL",
          note: "Order created",
          createdById: userId,
        },
      });

      return order;
    });
  },
};
