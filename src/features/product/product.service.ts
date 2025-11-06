import { BadRequestError, NotFoundError } from "../../utils/errors.js";
import {
  deleteFromSupabase,
  uploadToSupabase,
} from "../../utils/supabaseUploader.js";
import { ProductRepository } from "./product.repository.js";
import type { ProductScheme, ProductsQuerySchema } from "./product.types.js";

export const ProductService = {
  async getAllProducts({
    limit,
    cursor,
    category,
    type,
    search,
  }: ProductsQuerySchema) {
    return await ProductRepository.getAllProduct({
      limit,
      cursor,
      category,
      type,
      search,
    });
  },

  async createProduct(data: ProductScheme, file: Express.Multer.File) {
    if (!file) throw new BadRequestError("Product image is required");

    const fileLink = await uploadToSupabase(file, "product-images");

    const slug = data.name.toLowerCase().replace(/ /g, "-");
    const isProductSlugExist = await ProductRepository.findProductBySlug(slug);

    if (isProductSlugExist)
      throw new BadRequestError("Product name already exist");

    return await ProductRepository.createProduct({ data, fileLink, slug });
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

    const slug = data.name.toLowerCase().replace(/ /g, "-");

    const updatedProduct = await ProductRepository.updateProduct({
      id,
      data,
      ...(fileLink ? { fileLink } : ""),
      slug,
    });

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

  async getTotalProducts() {
    return await ProductRepository.getTotalProduct();
  },

  async updateActiveStatusProduct(id: string, isAvailable: boolean) {
    const existingProduct = await ProductRepository.getProductById(id);
    if (!existingProduct) throw new NotFoundError("Product not found");

    return await ProductRepository.updateActiveStatusProduct(id, isAvailable);
  },

  async getRecommendationProducts(limit: number = 6) {
    const topOrdered = await ProductRepository.getTopOrderedProductIds(limit);

    const productIds = topOrdered.map((item) => item.productId!);

    if (productIds.length === 0) return [];

    const products = await ProductRepository.findProductsForRecommendation(
      productIds
    );

    const orderedProducts = productIds
      .map((id) => products.find((p) => p.id === id))
      .filter(Boolean) as typeof products;

    return orderedProducts;
  },

  async getProductBySlug(slug: string) {
    if (!slug) throw new BadRequestError("Product slug is required");

    const product = await ProductRepository.findProductBySlug(slug);
    if (!product) throw new NotFoundError("Product not found");

    return await ProductRepository.findProductBySlug(slug);
  },
};
