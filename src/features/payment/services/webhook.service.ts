import { OrderStatus, PaymentStatus } from "@prisma/client";
import { OrderRepository } from "../../order/order.repository.js";
import { VoucherRepository } from "../../voucher/voucher.repository.js";
import { HistoryRepository } from "../../history/history.repository.js";

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

    return { orderId: order.id, newStatus };
  },
};
