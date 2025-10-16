import { Router } from "express";
import { ProductController } from "../product.controller.js";
import { asyncHandler } from "../../../middlewares/asyncHandler.js";
import { validate } from "../../../middlewares/validate.js";
import { ProductScheme, ProductsQuerySchema } from "../product.scheme.js";
import { upload } from "../../../middlewares/upload.js";

const router = Router();

router.get(
  "/",
  validate(ProductsQuerySchema, "query"),
  asyncHandler(ProductController.getAllProducts)
);

router.post(
  "/",
  upload.single("image"),
  validate(ProductScheme),
  asyncHandler(ProductController.createProduct)
);

router.put(
  "/:id",
  upload.single("image"),
  validate(ProductScheme),
  asyncHandler(ProductController.updateProduct)
);

router.delete("/:id", asyncHandler(ProductController.deleteProduct));

export default router;
