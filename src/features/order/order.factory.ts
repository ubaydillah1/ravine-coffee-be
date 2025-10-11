import { Prisma } from "@prisma/client";
import { BadRequestError } from "../../utils/errors.js";
import { ProductRepository } from "../product/product.repository.js";

export const OrderFactory = {
  async buildOrderItems(
    items: { productId: string; quantity: number }[],
    discountAmount: number = 0,
    taxRate: number = 10
  ) {
    if (!items.length) throw new BadRequestError("Items empty");

    const products = await ProductRepository.findManyProductsByIds(
      items.map((i) => i.productId)
    );

    const orderItemsData = items.map(({ productId, quantity }) => {
      const product = products.find((p) => p.id === productId);
      if (!product)
        throw new BadRequestError(`Product not found: ${productId}`);

      const subtotal = product.price.mul(quantity);

      return {
        productName: product.name,
        productImage: product.image,
        productPrice: product.price,
        quantity,
        price: product.price,
        subtotal,
      };
    });

    const subTotalAmount = orderItemsData.reduce(
      (sum, i) => sum.add(i.subtotal),
      new Prisma.Decimal(0)
    );

    const taxAmount = subTotalAmount.mul(taxRate).div(100);
    const totalAmount = subTotalAmount.add(taxAmount).sub(discountAmount);

    return {
      orderItemsData,
      subTotalAmount,
      taxAmount,
      discountAmount: new Prisma.Decimal(discountAmount),
      totalAmount,
      taxRate,
    };
  },
};
