import { OrderRepository } from "./order.repository.js";
import { AuthRepository } from "../auth/auth.repository.js";
import { OrderFactory } from "./order.factory.js";
import type { CheckoutInput, OrdersQueryInput } from "./order.types.js";
import {
  OrderStatus,
  PaymentStatus,
  Prisma,
  UserRole,
  type Voucher,
} from "@prisma/client";
import { PaymentService } from "../payment/services/payment.service.js";
import { UserRepository } from "../user/user.repository.js";
import { BadRequestError, NotFoundError } from "../../utils/errors.js";
import { config } from "../../lib/config.js";
import { generateQrisCodeSVG } from "../../utils/qrcode.js";
import { VoucherRepository } from "../voucher/voucher.repository.js";
import { HistoryRepository } from "../history/history.repository.js";

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

    let voucher: Voucher | null = null;

    if (data.voucherCode) {
      voucher = await VoucherRepository.getVoucherByCode(data.voucherCode);
    }

    const taxRate = data.taxRate ?? 10;

    const {
      orderItemsData,
      subTotalAmount,
      taxAmount,
      discountAmount: discount,
      totalAmount,
    } = await OrderFactory.buildOrderItems(
      data.items,
      voucher?.discountValue,
      taxRate
    );

    const paymentResult = await PaymentService.handlePayment(
      data.paymentMethod,
      totalAmount,
      data.orderChannel
    );

    const order = await OrderRepository.createOrder({
      customerId: customer.id,
      tableNumber: data.tableNumber || "",
      totalAmount,
      orderType: data.orderType,
      paymentMethod: data.paymentMethod,
      midtransOrderId: paymentResult.midtransOrderId,
      qrisMidtransUrl: paymentResult.qrisMidtransUrl,
      orderItemsData,
      internalQrCode: paymentResult.internalQrCode,
      discountAmount: discount,
      taxRate: new Prisma.Decimal(taxRate),
      taxAmount,
      subTotalAmount,
      cashierId: data.cashierId || null,
      notes: data.notes || null,
      expiredInternalQrCode: paymentResult.expiredInternalQrCode || null,
      expiredQrisMidtransUrl: paymentResult.expiredQrisMidtransUrl || null,
      voucherId: voucher?.id || null,
      orderChannel: data.orderChannel,
    });

    await HistoryRepository.createHistory({
      orderId: order.id,
      orderStatus: OrderStatus.OPENBILL,
    });

    let svgQrCode = null;
    if (paymentResult.internalQrCode) {
      const linkVerify = `${config.BASE_URL}/api/orders/verify-qrcode/${paymentResult.internalQrCode}`;
      svgQrCode = await generateQrisCodeSVG(linkVerify);
    }

    return {
      order,
      qrisUrl: paymentResult.qrisMidtransUrl,
      svgQrCode,
    };
  },

  async getOrderById(id: string) {
    return await OrderRepository.getOrderById(id);
  },

  async getOrders({
    limit,
    cursor,
    status,
    orderDate,
    search,
  }: OrdersQueryInput) {
    return await OrderRepository.getOrders({
      limit,
      cursor,
      status,
      search,
      orderDate,
    });
  },

  async updateOrderStatus(id: string, status: OrderStatus) {
    if (status === OrderStatus.CANCELED) {
      await OrderRepository.updatePaymentStatus(id, PaymentStatus.CANCELLED);
    }

    if (status === OrderStatus.COMPLETED) {
      await OrderRepository.updatePaymentStatus(id, PaymentStatus.SUCCESS);
    }

    await HistoryRepository.createHistory({
      orderId: id,
      orderStatus: status,
    });

    return await OrderRepository.updateOrderStatus(id, status);
  },

  async verifyInternalQris(code: string) {
    const existingOrder = await OrderRepository.getOrderByInternalQrCode(code);
    if (!existingOrder) throw new NotFoundError("Order not found");

    const expiredAt = existingOrder.expiredInternalQrCode;
    const now = new Date();

    if (expiredAt && now > expiredAt)
      throw new BadRequestError(
        "Order expired, Please tell the customer to order again"
      );

    const order = await OrderRepository.updateOrderStatus(
      existingOrder.id,
      OrderStatus.OPENBILL
    );

    return order;
  },

  async checkOrderStatus(id: string) {
    const order = await OrderRepository.getOrderById(id);
    if (!order) throw new NotFoundError("Order not found");

    return await OrderRepository.checkOrderStatus(id);
  },
};
