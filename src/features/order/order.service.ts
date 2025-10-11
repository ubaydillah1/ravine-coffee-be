import { OrderRepository } from "./order.repository.js";
import { AuthRepository } from "../auth/auth.repository.js";
import { OrderFactory } from "./order.factory.js";
import type { CheckoutInput } from "./order.types.js";
import { Prisma, UserRole } from "@prisma/client";
import { PaymentService } from "../payment/services/payment.service.js";
import { UserRepository } from "../user/user.repository.js";
import { BadRequestError, NotFoundError } from "../../utils/errors.js";

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

    if (data.cashierId) {
      const cashier = await UserRepository.getById(data.cashierId);
      if (!cashier) throw new NotFoundError("Cashier not found");
      if (cashier.role !== UserRole.CASHIER)
        throw new BadRequestError("Invalid Cashier Id");
    }

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
      cashierId: data.cashierId || null,
      notes: data.notes || null,
    });

    return {
      order,
      qrisUrl: paymentResult.qrisUrl,
      internalQrCode: paymentResult.internalQrCode,
    };
  },
};
