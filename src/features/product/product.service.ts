import { uploadToSupabase } from "../../lib/storage/supabaseUploader.js";
import { BadRequestError } from "../../utils/errors.js";
import { productRepository } from "./product.repository.js";
import type { CreateProductScheme } from "./product.types.js";

export const productService = {
  async getAllProducts({ limit, offset }: { limit: number; offset: number }) {
    return await productRepository.getAllProduct(limit, offset);
  },

  async createProduct(data: CreateProductScheme, file: Express.Multer.File) {
    if (!file) throw new BadRequestError("Product image is required");

    const fileLink = await uploadToSupabase(file, "product-images");

    return await productRepository.createProduct(data, fileLink);
  },
};
