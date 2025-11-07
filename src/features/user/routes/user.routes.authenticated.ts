import { Router } from "express";
import { asyncHandler } from "../../../middlewares/asyncHandler.js";
import { UserController } from "../user.controller.js";
import { validate } from "../../../middlewares/validate.js";
import { ProfileUpdateScheme } from "../user.scheme.js";
import { upload } from "../../../middlewares/upload.js";

const router = Router();

router.put(
  "/",
  upload.single("avatar"),
  validate(ProfileUpdateScheme),
  asyncHandler(UserController.editProfile)
);

router.delete("/avatar", asyncHandler(UserController.removeAvatar));

export default router;
