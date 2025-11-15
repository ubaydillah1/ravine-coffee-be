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

  async updateProduct({
    id,
    data,
    slug,
    fileLink,
  }: {
    id: string;
    data: ProductScheme;
    slug: string;
    fileLink?: string;
  }) {
    return await prisma.product.update({
      where: { id },
      data: {
        ...data,
        slug,
        description: data.description ?? null,
        ...(fileLink && { image: fileLink }),
      },
    });
  },

  async getAllProduct({
    limit,
    cursor,
    category,
    type,
    search,
  }: ProductsQuerySchema) {
    const where: any = {};

    if (type === "ACTIVE") where.isAvailable = true;
    if (type === "INACTIVE") where.isAvailable = false;
    if (category) where.category = category;

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ];
    }

    const products = await prisma.product.findMany({
      take: limit + 1,
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
      where,
      select: {
        name: true,
        id: true,
        image: true,
        category: true,
        isAvailable: true,
        price: true,
        description: true,
        slug: true,
      },
    });

    let nextCursor = null;
    if (products.length > limit) nextCursor = products.pop()?.id;

    return { products, nextCursor };
  },

  async createProduct({
    data,
    fileLink,
    slug,
  }: {
    data: ProductScheme;
    fileLink?: string;
    slug: string;
  }) {
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
      take: 7,
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

  async findProductBySlug(slug: string) {
    return prisma.product.findUnique({ where: { slug } });
  },
};
