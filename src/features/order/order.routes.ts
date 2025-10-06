import { validate } from "../../middlewares/validate.js";
import { OrderController } from "./order.controller.js";
import { Router } from "express";
import { createOrderSchema } from "./order.validation.js";

const router = Router();

router.post("/", validate(createOrderSchema), OrderController.create);

export default router;
