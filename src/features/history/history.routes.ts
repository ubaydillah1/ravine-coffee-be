import { Router } from "express";
import { HistoryContoller } from "./history.controller.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(HistoryContoller.getHistory));

export default router;
