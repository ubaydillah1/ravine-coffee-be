import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { Router } from "express";
import { UserController } from "./user.controller.js";
import { validate } from "../../middlewares/validate.js";
import { CashierSchema } from "./user.scheme.js";
import { upload } from "../../middlewares/upload.js";

const router = Router();

router.get("/", asyncHandler(UserController.getAllCashiers));
router.get("/:id", asyncHandler(UserController.getCashierById));

router.post(
  "/",
  upload.single("avatar"),
  validate(CashierSchema),
  asyncHandler(UserController.createCashier)
);

router.put(
  "/:id",
  validate(CashierSchema),
  upload.single("avatar"),
  asyncHandler(UserController.updateCashier)
);

router.delete("/:id", asyncHandler(UserController.deleteCashier));

export default router;
