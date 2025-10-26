import { Router } from "express";
import { HistoryContoller } from "./history.controller.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { validate } from "../../middlewares/validate.js";
import { HistoryQueryScheme } from "./history.scheme.js";

const router = Router();

router.get(
  "/",
  validate(HistoryQueryScheme, "query"),
  asyncHandler(HistoryContoller.getHistory)
);

router.get("/summary", asyncHandler(HistoryContoller.getSummary));

export default router;
