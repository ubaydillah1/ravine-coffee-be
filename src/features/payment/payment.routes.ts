import { Router } from "express";
import { PaymentController } from "./payment.controller.js";

const router = Router();

router.post("/webhook", PaymentController.webhook);
router.get(
  "/simulate-payment/:orderId",
  PaymentController.simulatePaymentStatus
);

export default router;
