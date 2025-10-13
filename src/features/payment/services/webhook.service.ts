import { OrderStatus, PaymentStatus } from "@prisma/client";
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
    } else if (transaction_status === "pending") {
      newStatus = PaymentStatus.PENDING;
    } else if (
      transaction_status === "cancel" ||
      transaction_status === "deny" ||
      transaction_status === "expire"
    ) {
      newStatus = PaymentStatus.CANCELLED;
    }

    await OrderRepository.updatePaymentStatus(order.id, newStatus);
    await OrderRepository.updateOrderStatus(order.id, OrderStatus.INPROGRESS);

    return { orderId: order.id, newStatus };
  },
};
