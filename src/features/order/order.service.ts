import { OrderRepository } from "./order.repository.js";
import { AuthRepository } from "../auth/auth.repository.js";
import { OrderFactory } from "./order.factory.js";
import type { CheckoutInput } from "./order.types.js";
import { PaymentService } from "./payment/payment.service.js";
import { Prisma } from "@prisma/client";

export const OrderService = {
  async create(data: CheckoutInput) {
    const user = await AuthRepository.existingEmail(data.email);
    const customer =
      user ??
      (await AuthRepository.registerIfNotExist({
        email: data.email,
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
      }));

    const discountAmount = data.discount ?? 0;
    const taxRate = data.taxRate ?? 10;

    const {
      orderItemsData,
      subTotalAmount,
      taxAmount,
      discountAmount: discount,
      totalAmount,
    } = await OrderFactory.buildOrderItems(data.items, discountAmount, taxRate);

    const paymentResult = await PaymentService.handlePayment(
      data.paymentMethod,
      totalAmount
    );

    const order = await OrderRepository.createOrder({
      customerId: customer.id,
      tableNumber: data.tableNumber,
      totalAmount,
      orderType: data.orderType,
      paymentMethod: data.paymentMethod,
      midtransOrderId: paymentResult.midtransOrderId,
      qrisUrl: paymentResult.qrisUrl,
      orderItemsData,
      internalQrCode: paymentResult.internalQrCode,
      discountAmount: discount,
      taxRate: new Prisma.Decimal(taxRate),
      taxAmount,
      subTotalAmount,
    });

    return {
      order,
      qrisUrl: paymentResult.qrisUrl,
      internalQrCode: paymentResult.internalQrCode,
    };
  },
};
