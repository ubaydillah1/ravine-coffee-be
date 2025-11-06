import type { Request, Response } from "express";
import { ProductService } from "./product.service.js";
import { ProductCategory } from "@prisma/client";

export const ProductController = {
  async createProduct(req: Request, res: Response) {
    const data = req.body;
    const file = req.file as Express.Multer.File;

    const product = await ProductService.createProduct(data, file);

    res.status(201).json({ message: "Product created successfully", product });
  },

  async getAllProducts(req: Request, res: Response) {
    const limit = parseInt(req.query.limit as string) || 12;
    const cursor = req.query.cursor as string | undefined;
    const category = (req.query.category as string).toUpperCase() as
      | ProductCategory
      | undefined;
    const search = req.query.search as string | undefined;

    const type = "ALL";

    const products = await ProductService.getAllProducts({
      limit,
      cursor,
      category,
      type,
      search,
    });

    res.json({ message: "Products fetched successfully", result: products });
  },

  async getProductsActive(req: Request, res: Response) {
    const limit = parseInt(req.query.limit as string) || 12;
    const cursor = req.query.cursor as string | undefined;
    const category = (req.query.category as string).toUpperCase() as
      | ProductCategory
      | undefined;
    const type = "ACTIVE";

    const products = await ProductService.getAllProducts({
      limit,
      cursor,
      category,
      type,
    });

    res.json({ message: "Products fetched successfully", result: products });
  },

  async updateProduct(req: Request, res: Response) {
    const { id } = req.params as { id: string };
    const data = req.body;
    const file = req.file as Express.Multer.File | undefined;

    const product = await ProductService.updateProduct(id, data, file);

    res.json({ message: "Product updated successfully", result: product });
  },

  async deleteProduct(req: Request, res: Response) {
    const { id } = req.params as { id: string };
    await ProductService.deleteProduct(id);
    res.json({ message: "Product deleted successfully" });
  },

  async getTotalProducts(_: Request, res: Response) {
    const total = await ProductService.getTotalProducts();
    res.json({ message: "Total products fetched successfully", result: total });
  },

  async updateActiveStatusProduct(req: Request, res: Response) {
    const { id } = req.params as { id: string };
    const isAvailable = req.body.isAvailable;

    const product = await ProductService.updateActiveStatusProduct(
      id,
      isAvailable
    );

    res.json({ message: "Product updated successfully", result: product });
  },

  async getRecommendationProducts(_: Request, res: Response) {
    const products = await ProductService.getRecommendationProducts();

    res.json({ message: "Products fetched successfully", result: products });
  },

  async getProductBySlug(req: Request, res: Response) {
    const { slug } = req.params as { slug: string };

    const product = await ProductService.getProductBySlug(slug);
    res.json({ message: "Product fetched successfully", result: product });
  },
};
