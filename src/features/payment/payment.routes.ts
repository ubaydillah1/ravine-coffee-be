import { Router } from "express";
import { PaymentController } from "./payment.controller.js";

const router = Router();

router.post("/webhook", PaymentController.webhook);

export default router;
