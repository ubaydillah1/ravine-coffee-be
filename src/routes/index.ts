import express from "express";
import orderRoutes from "../features/order/order.routes.js";
const router = express.Router();

router.use("/orders", orderRoutes);

export default router;
