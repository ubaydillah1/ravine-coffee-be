import express from "express";
import userRoutes from "../features/user/user.routes.js";
import orderRoutes from "../features/order/order.routes.js";
const router = express.Router();

router.use("/orders", orderRoutes);
router.use("/users", userRoutes);

export default router;
