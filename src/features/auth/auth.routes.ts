import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { safeGuard } from "../../middlewares/safeGuard.js";
import { AuthContoller } from "./auth.controller.js";
import { Router } from "express";

const router = Router();

router.get(
  "/me",
  safeGuard(["ADMIN", "CASHIER"]),
  asyncHandler(AuthContoller.me)
);
router.post("/login", asyncHandler(AuthContoller.login));

export default router;
