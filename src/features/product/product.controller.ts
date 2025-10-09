import type { Request, Response } from "express";
import { ProductService } from "./product.service.js";
import { ProductCategory } from "@prisma/client";

export const ProductController = {
  async createProduct(req: Request, res: Response) {
    const data = req.body;
    const file = req.file as Express.Multer.File;

    await ProductService.createProduct(data, file);

    res.status(201).json({ message: "Product created successfully" });
  },

  async getAllProducts(req: Request, res: Response) {
    const limit = parseInt(req.query.limit as string) || 12;
    const offset = parseInt(req.query.offset as string) || 0;
    const category = (req.query.category as string).toUpperCase();

    const products = await ProductService.getAllProducts({
      limit,
      offset,
      category: category as ProductCategory,
    });

    res.status(200).json(products);
  },

  async updateProduct(req: Request, res: Response) {
    const { id } = req.params as { id: string };
    const data = req.body;
    const file = req.file as Express.Multer.File | undefined;

    await ProductService.updateProduct(id, data, file);

    res.status(200).json({ message: "Product updated successfully" });
  },

  async deleteProduct(req: Request, res: Response) {
    const { id } = req.params as { id: string };
    await ProductService.deleteProduct(id);
    res.status(200).json({ message: "Product deleted successfully" });
  },
};
