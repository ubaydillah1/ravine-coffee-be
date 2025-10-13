import { validate } from "../../../middlewares/validate.js";
import { OrderController } from "../order.controller.js";
import { Router } from "express";
import { asyncHandler } from "../../../middlewares/asyncHandler.js";
import { CheckoutSchema } from "../order.scheme.js";

const router = Router();

router.post(
  "/",
  validate(CheckoutSchema),
  asyncHandler(OrderController.createOrder),
  OrderController.createOrder
);

export default router;
