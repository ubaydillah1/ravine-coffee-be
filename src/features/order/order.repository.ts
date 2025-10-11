import { OrderStatus, type PaymentStatus } from "@prisma/client";
import prisma from "../../lib/prisma.js";
import type { CreateOrderInput } from "./order.types.js";

export const OrderRepository = {
  async createOrder(data: CreateOrderInput) {
    return prisma.order.create({
      data: {
        customerId: data.customerId,
        cashierId: data.cashierId || null,
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
        notes: data.notes || null,

        OrderItem: {
          create: data.orderItemsData.map((item) => ({
            quantity: item.quantity,
            subtotal: item.subtotal,
            productName: item.productName,
            productImage: item.productImage,
            productPrice: item.productPrice,
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
            quantity: true,
            productImage: true,
            productName: true,
            productPrice: true,
          },
        },
      },
    });
  },
  async getOrderById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        tableNumber: true,
        createdAt: true,
        orderType: true,
        taxAmount: true,
        paymentMethod: true,
        subTotalAmount: true,
        discountAmount: true,
        notes: true,
        Voucher: {
          select: {
            code: true,
          },
        },
        Customer: {
          select: {
            fullName: true,
            phoneNumber: true,
            email: true,
          },
        },
        OrderItem: {
          select: {
            quantity: true,
            subtotal: true,
            productImage: true,
            productName: true,
            productPrice: true,
          },
        },
        Cashier: {
          select: {
            fullName: true,
          },
        },
      },
    });
  },

  async getOrderByMidtransId(midtransOrderId: string) {
    return prisma.order.findUnique({
      where: {
        midtransOrderId: midtransOrderId,
      },
    });
  },

  async updatePaymentStatus(id: string, paymentStatus: PaymentStatus) {
    return prisma.order.update({
      where: { id },
      data: { paymentStatus, orderStatus: OrderStatus.INPROGRESS },
    });
  },

  async getOrders(limit = 10, cursor?: string) {
    const items = await prisma.order.findMany({
      select: {
        id: true,
        createdAt: true,
        totalAmount: true,
        tableNumber: true,
        orderStatus: true,
        Customer: {
          select: { fullName: true },
        },
      },
      take: limit + 1,
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
      orderBy: { createdAt: "desc" },
    });

    let nextCursor = null;
    if (items.length > limit) {
      nextCursor = items.pop()?.id;
    }
    return { items, nextCursor };
  },
};
