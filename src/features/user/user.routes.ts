import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { Router } from "express";
import { UserController } from "./user.controller.js";

const router = Router();

router.post("/", asyncHandler(UserController.create));

export default router;
