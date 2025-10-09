import prisma from "../../lib/prisma.js";
import type { CreateProductScheme } from "./product.types.js";

export const productRepository = {
  async getProductById(id: string) {
    return await prisma.product.findUnique({ where: { id } });
  },

  async getAllProduct(limit: number = 12, offset: number = 0) {
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
    }); 
  },

  async createProduct(data: CreateProductScheme, fileLink?: string) {
    return await prisma.product.create({
      data: {
        ...data,
        description: data.description ?? null,
        ...(fileLink && { image: fileLink }),
      },
    });
  },
};
