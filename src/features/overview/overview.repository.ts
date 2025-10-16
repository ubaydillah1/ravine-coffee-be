import prisma from "../../lib/prisma.js";
import type { Period } from "../../types/table.js";
import { OrderStatus } from "@prisma/client";
import { getDateRange } from "../../helpers/date-range.js";

export const OverviewRepository = {
  async getSummary(period: Period = "today", fromDate?: Date, toDate?: Date) {
    const range =
      fromDate && toDate
        ? { gte: fromDate, lte: toDate }
        : getDateRange(period);

    const where = {
      orderStatus: OrderStatus.COMPLETED,
      createdAt: range,
    };

    const [count, aggregate] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        _avg: { totalAmount: true, taxAmount: true },
        where,
      }),
    ]);

    return {
      totalRevenue: Number(aggregate._sum.totalAmount ?? 0),
      totalOrders: count,
      averageExpenses: Number(aggregate._avg.taxAmount ?? 0),
      averageRevenue: Number(aggregate._avg.totalAmount ?? 0),
    };
  },

  async getRevenueChart(period: Period = "today") {
    const { gte, lte } = getDateRange(period);

    const revenue = await prisma.order.groupBy({
      by: ["createdAt"],
      _sum: { totalAmount: true },
      where: {
        orderStatus: OrderStatus.COMPLETED,
        createdAt: { gte, lte },
      },
      orderBy: { createdAt: "asc" },
    });

    return {
      period,
      data: revenue.map((r) => ({
        date: r.createdAt.toISOString().split("T")[0],
        total: Number(r._sum.totalAmount ?? 0),
      })),
    };
  },

  async getOrderTypes(period: Period = "today") {
    const { gte, lte } = getDateRange(period);

    const data = await prisma.order.groupBy({
      by: ["orderType"],
      _count: true,
      where: {
        orderStatus: OrderStatus.COMPLETED,
        createdAt: { gte, lte },
      },
    });

    return {
      period,
      data: data.map((d) => ({
        type: d.orderType || "Unknown",
        count: d._count,
      })),
    };
  },

  async getPaymentMethods(period: Period = "today") {
    const { gte, lte } = getDateRange(period);

    const data = await prisma.order.groupBy({
      by: ["paymentMethod"],
      _count: true,
      where: {
        orderStatus: OrderStatus.COMPLETED,
        createdAt: { gte, lte },
      },
    });

    return {
      period,
      data: data.map((d) => ({
        method: d.paymentMethod || "CASH",
        count: d._count,
      })),
    };
  },

  async getCategorySales(period: Period = "today") {
    const { gte, lte } = getDateRange(period);

    const data = await prisma.orderItem.groupBy({
      by: ["productName"],
      _sum: { subtotal: true },
      where: {
        order: {
          orderStatus: OrderStatus.COMPLETED,
          createdAt: { gte, lte },
        },
      },
    });

    return {
      period,
      data: data.map((d) => ({
        category: d.productName,
        total: Number(d._sum.subtotal ?? 0),
      })),
    };
  },

  async getTodayCompletedOrders() {
    const { gte, lte } = getDateRange("today");

    const orders = await prisma.order.findMany({
      where: {
        orderStatus: OrderStatus.COMPLETED,
        createdAt: { gte, lte },
      },
      select: {
        id: true,
        totalAmount: true,
        OrderItem: {
          select: {
            productName: true,
            productImage: true,
            quantity: true,
            subtotal: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return orders.flatMap((order) =>
      order.OrderItem.map((item) => ({
        id: order.id,
        name: item.productName,
        qty: item.quantity,
        image: item.productImage,
        price: Number(item.subtotal),
      }))
    );
  },
};
