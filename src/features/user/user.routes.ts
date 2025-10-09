import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { Router } from "express";
import { UserController } from "./user.controller.js";

const router = Router();

router.post("/", asyncHandler(UserController.createCashier));

export default router;
