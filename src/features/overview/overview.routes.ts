import { Router } from "express";
import { OverviewController } from "./overview.controller.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { validate } from "../../middlewares/validate.js";
import { OverviewQuerySchema, RevenueChartQuerySchema } from "./overview.scheme.js";

const router = Router();

router.get(
  "/",
  validate(OverviewQuerySchema, "query"),
  asyncHandler(OverviewController.getOverview)
);

router.get(
  "/summary",
  validate(OverviewQuerySchema, "query"),
  asyncHandler(OverviewController.getSummary)
);

router.get(
  "/revenue-chart",
  validate(RevenueChartQuerySchema, "query"),
  asyncHandler(OverviewController.getRevenueChart)
);

router.get(
  "/order-types",
  validate(OverviewQuerySchema, "query"),
  asyncHandler(OverviewController.getOrderTypes)
);

router.get(
  "/payment-methods",
  validate(OverviewQuerySchema, "query"),
  asyncHandler(OverviewController.getPaymentMethods)
);

router.get(
  "/category-sales",
  validate(OverviewQuerySchema, "query"),
  asyncHandler(OverviewController.getCategorySales)
);

router.get(
  "/order-today",
  asyncHandler(OverviewController.getTodayCompletedOrders)
);

export default router;
