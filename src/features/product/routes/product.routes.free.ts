import { Router } from "express";
import { asyncHandler } from "../../../middlewares/asyncHandler.js";
import { ProductController } from "../product.controller.js";
import { validate } from "../../../middlewares/validate.js";
import { ProductsQuerySchema } from "../product.scheme.js";

const router = Router();

router.get(
  "/",
  validate(ProductsQuerySchema, "query"),
  asyncHandler(ProductController.getAllProducts)
);

router.get(
  "/recommendations",
  asyncHandler(ProductController.getRecommendationProducts)
);

export default router;
