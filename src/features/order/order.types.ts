import type {
  OrderChannel,
  OrderType,
  PaymentMethod,
  Prisma,
} from "@prisma/client";
import type { CheckoutSchema, OrdersQuerySchema } from "./order.scheme.js";
import type { z } from "zod";

export type CheckoutInput = z.infer<typeof CheckoutSchema>;
export type OrdersQueryInput = z.infer<typeof OrdersQuerySchema>;

export type CreateOrderInput = {
  customerId: string;
  cashierId?: string | null;
  tableNumber: string;
  totalAmount: Prisma.Decimal;
  orderType: OrderType;
  paymentMethod: PaymentMethod;
  midtransOrderId?: string | null;
  internalQrCode?: string | null;
  qrisMidtransUrl?: string | null;
  discountAmount: Prisma.Decimal;
  taxRate: Prisma.Decimal;
  taxAmount: Prisma.Decimal;
  subTotalAmount: Prisma.Decimal;
  voucherId?: string | null;
  notes?: string | null;
  expiredInternalQrCode?: Date | null;
  expiredQrisMidtransUrl?: Date | null;
  orderChannel: OrderChannel;

  orderItemsData: {
    quantity: number;
    subtotal: Prisma.Decimal;
    productName: string;
    productImage: string | null;
    productPrice: Prisma.Decimal;
  }[];
};
