import { validate } from "../../middlewares/validate.js";
import { OrderController } from "./order.controller.js";
import { Router } from "express";
import { CreateOrderSchema } from "./order.scheme.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";

const router = Router();

router.post(
  "/",
  validate(CreateOrderSchema),
  asyncHandler(OrderController.create),
  OrderController.create
);

export default router;
