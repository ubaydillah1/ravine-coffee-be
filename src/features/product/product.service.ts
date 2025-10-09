import { ProductCategory } from "@prisma/client";
import {
  deleteFromSupabase,
  uploadToSupabase,
} from "../../lib/storage/supabaseUploader.js";
import { BadRequestError, NotFoundError } from "../../utils/errors.js";
import { ProductRepository } from "./product.repository.js";
import type { ProductScheme } from "./product.types.js";

export const ProductService = {
  async getAllProducts({
    limit,
    offset,
    category,
  }: {
    limit: number;
    offset: number;
    category?: ProductCategory;
  }) {
    return await ProductRepository.getAllProduct(limit, offset, category);
  },

  async createProduct(data: ProductScheme, file: Express.Multer.File) {
    if (!file) throw new BadRequestError("Product image is required");

    const fileLink = await uploadToSupabase(file, "product-images");

    return await ProductRepository.createProduct(data, fileLink);
  },

  async updateProduct(
    id: string,
    data: ProductScheme,
    file?: Express.Multer.File
  ) {
    const existingProduct = await ProductRepository.getProductById(id);
    if (!existingProduct) throw new NotFoundError("Product not found");

    let fileLink = existingProduct.image ?? undefined;

    if (file) {
      if (existingProduct.image) {
        await deleteFromSupabase(existingProduct.image, "product-images");
      }

      fileLink = await uploadToSupabase(file, "product-images");
    }

    const updatedProduct = await ProductRepository.updateProduct(
      id,
      data,
      fileLink
    );

    return updatedProduct;
  },

  async deleteProduct(id: string) {
    const existingProduct = await ProductRepository.getProductById(id);
    if (!existingProduct) throw new NotFoundError("Product not found");

    if (existingProduct.image) {
      await deleteFromSupabase(existingProduct.image, "product-images");
    }

    return await ProductRepository.deleteProduct(id);
  },
};
