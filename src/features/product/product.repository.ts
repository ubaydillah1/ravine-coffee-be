import type { ProductCategory } from "@prisma/client";
import prisma from "../../lib/prisma.js";
import type { ProductScheme } from "./product.types.js";

export const ProductRepository = {
  async getProductById(id: string) {
    return await prisma.product.findUnique({ where: { id } });
  },

  async updateProduct(id: string, data: ProductScheme, fileLink?: string) {
    return await prisma.product.update({
      where: { id },
      data: {
        ...data,
        description: data.description ?? null,
        ...(fileLink && { image: fileLink }),
      },
    });
  },

  async getAllProduct(
    limit: number = 12,
    offset: number = 0,
    category?: ProductCategory
  ) {
    return await prisma.product.findMany({
      take: limit,
      skip: offset,
      select: {
        name: true,
        id: true,
        image: true,
        category: true,
        isAvailable: true,
        price: true,
        description: true,
      },
      ...(category && { where: { category } }),
    });
  },

  async createProduct(data: ProductScheme, fileLink?: string) {
    return await prisma.product.create({
      data: {
        ...data,
        description: data.description ?? null,
        ...(fileLink && { image: fileLink }),
      },
    });
  },

  async deleteProduct(id: string) {
    return await prisma.product.delete({ where: { id } });
  },
};
