import prisma from "../../lib/prisma.js";
import type { ProductScheme, ProductsQuerySchema } from "./product.types.js";

export const ProductRepository = {
  async getProductById(id: string) {
    return await prisma.product.findUnique({ where: { id } });
  },

  async findManyProductsByIds(ids: string[]) {
    return prisma.product.findMany({ where: { id: { in: ids } } });
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

  async getAllProduct({ limit, page, category }: ProductsQuerySchema) {
    const offset = (page - 1) * limit;

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
