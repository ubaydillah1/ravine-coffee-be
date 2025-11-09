import { OrderStatus, PaymentStatus } from "@prisma/client";
import { VoucherRepository } from "../../voucher/voucher.repository.js";
import { HistoryRepository } from "../../history/history.repository.js";
import { SOCKET_EVENTS } from "../../../constants/socketEvents.js";
import { io } from "../../../index.js";
import { OrderRepository } from "../../order/order.repository.js";

export const PaymentWebhookService = {
  async handleWebhook(notification: any) {
    const { order_id, transaction_status } = notification;

    const order = await OrderRepository.getOrderByMidtransId(order_id);
    if (!order) throw new Error("Order not found");

    let newStatus = order.paymentStatus;

    if (
      transaction_status === "capture" ||
      transaction_status === "settlement"
    ) {
      newStatus = PaymentStatus.SUCCESS;

      await HistoryRepository.createHistory({
        orderId: order.id,
        orderStatus: OrderStatus.COMPLETED,
      });

      if (order.voucherId) {
        await VoucherRepository.addOneUsage(order.voucherId);
      }
    }

    if (transaction_status === "pending") {
      newStatus = PaymentStatus.PENDING;
    }

    if (
      transaction_status === "cancel" ||
      transaction_status === "deny" ||
      transaction_status === "expire"
    ) {
      await HistoryRepository.createHistory({
        orderId: order.id,
        orderStatus: OrderStatus.CANCELED,
      });

      newStatus = PaymentStatus.CANCELLED;
    }

    await OrderRepository.updatePaymentStatus(order.id, newStatus);
    await OrderRepository.updateOrderStatus(order.id, OrderStatus.INPROGRESS);

    if (
      newStatus === PaymentStatus.SUCCESS ||
      newStatus === PaymentStatus.CANCELLED
    ) {
      io.to(order.id).emit(SOCKET_EVENTS.ORDER.PAYMENT_STATUS, {
        orderId: order.id,
        status: newStatus,
      });

      io.to("cashiers").emit(SOCKET_EVENTS.CASHIER.REFRESH_ORDER);
    }

    return { orderId: order.id, newStatus };
  },

  async simulatePaymentStatus(orderId: string) {
    const order = await OrderRepository.getOrderById(orderId);
    if (!order) throw new Error("Order not found");
    
    const mockNotification = {
      order_id: order.midtransOrderId,
      transaction_status: "settlement",
    };

    await this.handleWebhook(mockNotification);

    return null;
  },
};
