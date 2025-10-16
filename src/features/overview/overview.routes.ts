import { Router } from "express";
import { OverviewController } from "./overview.controller.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { validate } from "../../middlewares/validate.js";
import { OverviewQuerySchema } from "./overview.scheme.js";

const router = Router();

router.get(
  "/",
  validate(OverviewQuerySchema, "query"),
  asyncHandler(OverviewController.getOverview)
);

router.get(
  "/order-today",
  asyncHandler(OverviewController.getTodayCompletedOrders)
);

export default router;
