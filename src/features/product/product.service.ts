import { ProductCategory } from "@prisma/client";
import {
  deleteFromSupabase,
  uploadToSupabase,
} from "../../lib/storage/supabaseUploader.js";
import { BadRequestError, NotFoundError } from "../../utils/errors.js";
import { productRepository } from "./product.repository.js";
import type { ProductScheme } from "./product.types.js";

export const productService = {
  async getAllProducts({
    limit,
    offset,
    category,
  }: {
    limit: number;
    offset: number;
    category?: ProductCategory;
  }) {
    return await productRepository.getAllProduct(limit, offset, category);
  },

  async createProduct(data: ProductScheme, file: Express.Multer.File) {
    if (!file) throw new BadRequestError("Product image is required");

    const fileLink = await uploadToSupabase(file, "product-images");

    return await productRepository.createProduct(data, fileLink);
  },

  async updateProduct(
    id: string,
    data: ProductScheme,
    file?: Express.Multer.File
  ) {
    const existingProduct = await productRepository.getProductById(id);
    if (!existingProduct) throw new NotFoundError("Product not found");

    let fileLink = existingProduct.image ?? undefined;

    if (file) {
      if (existingProduct.image) {
        await deleteFromSupabase(existingProduct.image, "product-images");
      }

      fileLink = await uploadToSupabase(file, "product-images");
    }

    const updatedProduct = await productRepository.updateProduct(
      id,
      data,
      fileLink
    );

    return updatedProduct;
  },

  async deleteProduct(id: string) {
    const existingProduct = await productRepository.getProductById(id);
    if (!existingProduct) throw new NotFoundError("Product not found");

    if (existingProduct.image) {
      await deleteFromSupabase(existingProduct.image, "product-images");
    }

    return await productRepository.deleteProduct(id);
  },
};
