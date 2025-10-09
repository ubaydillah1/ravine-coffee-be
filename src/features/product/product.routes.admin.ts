import { Router } from "express";
import { productController } from "./product.controller.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { validate } from "../../middlewares/validate.js";
import { createProductScheme } from "./product.scheme.js";
import { upload } from "../../middlewares/upload.js";

const router = Router();

router.get("/", asyncHandler(productController.getAllProducts));

router.post(
  "/",
  upload.single("image"),
  validate(createProductScheme),
  asyncHandler(productController.createProduct)
);

export default router;
