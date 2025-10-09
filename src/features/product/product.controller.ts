  import type { Request, Response } from "express";
  import { productService } from "./product.service.js";
  import { ProductCategory, type Product } from "@prisma/client";

  export const productController = {
    async createProduct(req: Request, res: Response) {
      const data = req.body;
      const file = req.file as Express.Multer.File;

      await productService.createProduct(data, file);

      res.status(201).json({ message: "Product created successfully" });
    },

    async getAllProducts(req: Request, res: Response) {
      const limit = parseInt(req.query.limit as string) || 12;
      const offset = parseInt(req.query.offset as string) || 0;
      const category = (req.query.category as string).toUpperCase();

      const products = await productService.getAllProducts({
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

      await productService.updateProduct(id, data, file);

      res.status(200).json({ message: "Product updated successfully" });
    },

    async deleteProduct(req: Request, res: Response) {
      const { id } = req.params as { id: string };
      await productService.deleteProduct(id);
      res.status(200).json({ message: "Product deleted successfully" });
    },
  };
