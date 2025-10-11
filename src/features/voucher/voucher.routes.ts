import { Router } from "express";
import { VoucherController } from "./voucher.controller.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { validate } from "../../middlewares/validate.js";
import { VoucherQuerySchema, VoucherScheme } from "./voucher.scheme.js";

const router = Router();

router.get(
  "/",
  validate(VoucherQuerySchema, "query"),
  asyncHandler(VoucherController.getAllVouchers)
);

router.get("/:id", asyncHandler(VoucherController.getVoucherById));

router.post(
  "/",
  validate(VoucherScheme),
  asyncHandler(VoucherController.createVoucher)
);

router.put(
  "/:id",
  validate(VoucherScheme),
  asyncHandler(VoucherController.updateVoucher)
);

router.delete("/:id", asyncHandler(VoucherController.deleteVoucher));

export default router;
