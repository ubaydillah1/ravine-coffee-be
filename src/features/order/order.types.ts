import type { OrderType, PaymentMethod, Prisma } from "@prisma/client";
import type { CheckoutSchema } from "./order.scheme.js";
import type { z } from "zod";

export type CheckoutInput = z.infer<typeof CheckoutSchema>;

export type CreateOrderInput = {
  customerId: string;
  cashierId?: string | null;
  tableNumber: string;
  totalAmount: Prisma.Decimal;
  orderType: OrderType;
  paymentMethod: PaymentMethod;
  midtransOrderId?: string | null;
  internalQrCode?: string | null;
  qrisUrl?: string | null;
  discountAmount: Prisma.Decimal;
  taxRate: Prisma.Decimal;
  taxAmount: Prisma.Decimal;
  subTotalAmount: Prisma.Decimal;
  voucherId?: string | null;
  notes?: string | null;

  orderItemsData: {
    quantity: number;
    subtotal: Prisma.Decimal;
    productName: string;
    productImage: string | null;
    productPrice: Prisma.Decimal;
  }[];
};
