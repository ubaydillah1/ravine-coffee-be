import express from "express";
import userRoutes from "../features/user/user.routes.js";
import orderRoutes from "../features/order/order.routes.js";
import authRoutes from "../features/auth/auth.routes.js";
import productAdminRoutes from "../features/product/product.routes.admin.js";
import voucherRoutes from "../features/voucher/voucher.routes.js";
import { safeGuard } from "../middlewares/safeGuard.js";
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/orders", orderRoutes);

router.use("/admin/users", safeGuard("ADMIN"), userRoutes);
router.use("/admin/products", safeGuard("ADMIN"), productAdminRoutes);
router.use("/admin/vouchers", safeGuard("ADMIN"), voucherRoutes);

export default router;
