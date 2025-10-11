import prisma from "../../lib/prisma.js";
import type { CreateOrderInput } from "./order.types.js";

export const OrderRepository = {
  async createOrder(data: CreateOrderInput) {
    return prisma.order.create({
      data: {
        customerId: data.customerId,
        tableNumber: data.tableNumber,
        orderType: data.orderType,
        paymentMethod: data.paymentMethod,
        midtransOrderId: data.midtransOrderId || null,
        internalQrCode: data.internalQrCode || null,
        qrisUrl: data.qrisUrl || null,
        totalAmount: data.totalAmount,
        discountAmount: data.discountAmount,
        taxRate: data.taxRate,
        taxAmount: data.taxAmount,
        subTotalAmount: data.subTotalAmount,
        voucherId: data.voucherId || null,

        OrderItem: {
          create: data.orderItemsData.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            subtotal: item.subtotal,
          })),
        },
      },
      select: {
        id: true,
        paymentMethod: true,
        subTotalAmount: true,
        taxAmount: true,
        discountAmount: true,
        totalAmount: true,
        orderType: true,
        qrisUrl: true,
        internalQrCode: true,
        OrderItem: {
          select: {
            productId: true,
            quantity: true,
            product: {
              select: { name: true, price: true },
            },
          },
        },
      },
    });
  },
};
