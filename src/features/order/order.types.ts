import type { OrderType, PaymentMethod } from "@prisma/client";

export interface CreateOrderParams {
  userId: string;
  tableNumber: string;
  orderType: OrderType;
  paymentMethod: PaymentMethod;
  items: { productId: string; quantity: number }[];
}
