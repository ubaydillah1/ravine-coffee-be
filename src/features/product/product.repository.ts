import prisma from "../../lib/prisma.js";
import type { ProductScheme, ProductsQuerySchema } from "./product.types.js";

export const ProductRepository = {
  async getProductById(id: string) {
    return await prisma.product.findUnique({ where: { id } });
  },

  async findManyProductsByIds(ids: string[]) {
    return prisma.product.findMany({ where: { id: { in: ids } } });
  },

  async updateActiveStatusProduct(id: string, isAvailable: boolean) {
    return await prisma.product.update({
      where: { id },
      data: { isAvailable },
    });
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

  async getAllProduct({ limit, cursor, category }: ProductsQuerySchema) {
    const products = await prisma.product.findMany({
      take: limit + 1,
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
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

    let nextCursor = null;
    if (products.length > limit) nextCursor = products.pop()?.id;

    return { products, nextCursor };
  },

  async createProduct(data: ProductScheme, fileLink?: string) {
    const slug = data.name.toLowerCase().replace(/ /g, "-");

    return await prisma.product.create({
      data: {
        ...data,
        slug,
        description: data.description ?? null,
        ...(fileLink && { image: fileLink }),
      },
    });
  },

  async deleteProduct(id: string) {
    return await prisma.product.delete({ where: { id } });
  },

  async getTotalProduct() {
    return await prisma.product.count();
  },

  async getTopOrderedProductIds(limit: number = 6) {
    return prisma.orderItem.groupBy({
      by: ["productId"],
      _count: { productId: true },
      orderBy: {
        _count: {
          productId: "desc",
        },
      },
      where: {
        productId: {
          not: null,
        },
      },
      take: limit,
    });
  },

  async findProductsForRecommendation(ids: string[]) {
    return prisma.product.findMany({
      where: {
        id: { in: ids },
        isAvailable: true,
      },
      select: {
        id: true,
        name: true,
        image: true,
        price: true,
        category: true,
      },
    });
  },

  async findProductsBySlug(slug: string) {
    return prisma.product.findMany({ where: { slug } });
  },
};
