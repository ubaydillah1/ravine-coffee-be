import prisma from "../../lib/prisma.js";
import type { Period } from "../../types/table.js";
import { OrderStatus, ProductCategory } from "@prisma/client";
import { getDateRange, type RevenuePeriod } from "../../helpers/date-range.js";
import {
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subMonths,
  subWeeks,
  subYears,
} from "date-fns";

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

  async getRevenueChart(period: RevenuePeriod = "weekly") {
    const now = new Date();
    let currentFrom: Date, currentTo: Date;
    let lastFrom: Date, lastTo: Date;
    let labels: string[] = [];

    switch (period) {
      case "weekly":
        currentFrom = startOfWeek(now, { weekStartsOn: 1 });
        currentTo = endOfWeek(now, { weekStartsOn: 1 });
        lastFrom = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
        lastTo = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
        labels = [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ];
        break;

      case "monthly":
        currentFrom = startOfMonth(now);
        currentTo = endOfMonth(now);
        lastFrom = startOfMonth(subMonths(now, 1));
        lastTo = endOfMonth(subMonths(now, 1));
        labels = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        break;

      case "annual":
        currentFrom = startOfYear(now);
        currentTo = endOfYear(now);
        lastFrom = startOfYear(subYears(now, 1));
        lastTo = endOfYear(subYears(now, 1));
        labels = Array.from({ length: 5 }, (_, i) =>
          String(now.getFullYear() - 4 + i)
        );
        break;
    }

    const [currentOrders, lastOrders] = await Promise.all([
      prisma.order.findMany({
        where: {
          orderStatus: OrderStatus.COMPLETED,
          createdAt: { gte: currentFrom, lte: currentTo },
        },
        select: { createdAt: true, totalAmount: true },
      }),
      prisma.order.findMany({
        where: {
          orderStatus: OrderStatus.COMPLETED,
          createdAt: { gte: lastFrom, lte: lastTo },
        },
        select: { createdAt: true, totalAmount: true },
      }),
    ]);

    const currentTotals = new Map<string, number>();
    const lastTotals = new Map<string, number>();

    for (const order of currentOrders) {
      let key: string;
      if (period === "weekly") key = format(order.createdAt, "EEEE");
      else if (period === "monthly") key = format(order.createdAt, "MMMM");
      else key = format(order.createdAt, "yyyy");
      currentTotals.set(
        key,
        (currentTotals.get(key) ?? 0) + Number(order.totalAmount ?? 0)
      );
    }

    for (const order of lastOrders) {
      let key: string;
      if (period === "weekly") key = format(order.createdAt, "EEEE");
      else if (period === "monthly") key = format(order.createdAt, "MMMM");
      else key = format(order.createdAt, "yyyy");
      lastTotals.set(
        key,
        (lastTotals.get(key) ?? 0) + Number(order.totalAmount ?? 0)
      );
    }

    return labels.map((label) => ({
      label,
      current: currentTotals.get(label) ?? 0,
      last: lastTotals.get(label) ?? 0,
    }));
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

    const total = data.reduce((sum, d) => sum + d._count, 0);

    const defaultTypes = ["DINE_IN", "TAKE_AWAY"];

    const merged = defaultTypes.map((type) => {
      const found = data.find((d) => d.orderType === type);
      const count = found?._count ?? 0;
      const percentage = total ? (count / total) * 100 : 0;
      return {
        type,
        count,
        percentage,
      };
    });

    return merged;
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

    const total = data.reduce((sum, d) => sum + d._count, 0);

    const defaultMethods = ["QRIS", "CASH"];

    const merged = defaultMethods.map((method) => {
      const found = data.find((d) => d.paymentMethod === method);
      const count = found?._count ?? 0;
      const percentage = total ? (count / total) * 100 : 0;
      return {
        method,
        count,
        percentage,
      };
    });

    return merged;
  },

  async getCategorySales(period: Period = "today") {
    const { gte, lte } = getDateRange(period);

    const grouped = await prisma.orderItem.groupBy({
      by: ["productCategory"],
      _count: { productCategory: true },
      where: {
        Order: {
          orderStatus: OrderStatus.COMPLETED,
          createdAt: { gte, lte },
        },
      },
    });

    const totalAll = grouped.reduce(
      (sum, g) => sum + g._count.productCategory,
      0
    );

    return Object.values(ProductCategory).map((cat) => {
      const found = grouped.find((g) => g.productCategory === cat);
      const count = found?._count.productCategory ?? 0;

      const percentage = totalAll ? (count / totalAll) * 100 : 0;

      return {
        category: cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase(),
        total: percentage,
      };
    });
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
