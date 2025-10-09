import { Router } from "express";
import { productController } from "./product.controller.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { validate } from "../../middlewares/validate.js";
import { productScheme, getAllProductsQuerySchema } from "./product.scheme.js";
import { upload } from "../../middlewares/upload.js";

const router = Router();

router.get(
  "/",
  validate(getAllProductsQuerySchema, "query"),
  asyncHandler(productController.getAllProducts)
);

router.post(
  "/",
  upload.single("image"),
  validate(productScheme),
  asyncHandler(productController.createProduct)
);

router.put(
  "/:id",
  upload.single("image"),
  validate(productScheme),
  asyncHandler(productController.updateProduct)
);

router.delete("/:id", asyncHandler(productController.deleteProduct));

export default router;
