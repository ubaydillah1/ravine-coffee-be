import { OrderController } from "../order.controller.js";
import { Router } from "express";
import { asyncHandler } from "../../../middlewares/asyncHandler.js";
import { validate } from "../../../middlewares/validate.js";
import { OrdersQuerySchema, StatusOrderScheme } from "../order.scheme.js";

const router = Router();

router.get(
  "/",
  validate(OrdersQuerySchema, "query"),
  asyncHandler(OrderController.getOrders)
);

router.get("/:id", asyncHandler(OrderController.getSingleOrder));

router.patch(
  "/:id",
  validate(StatusOrderScheme),
  asyncHandler(OrderController.updateStatusOrder)
);

router.get(
  "/verify-qrcode/:code",
  asyncHandler(OrderController.verifyInternalQRCode)
);

export default router;
