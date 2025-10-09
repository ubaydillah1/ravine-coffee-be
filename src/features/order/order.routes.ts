import { validate } from "../../middlewares/validate.js";
import { OrderController } from "./order.controller.js";
import { Router } from "express";
import { createOrderSchema } from "./order.scheme.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";

const router = Router();

router.post(
  "/",
  validate(createOrderSchema),
  asyncHandler(OrderController.create)
);

export default router;
