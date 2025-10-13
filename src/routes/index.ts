import express from "express";
import userRoutes from "../features/user/user.routes.js";
import orderRoutes from "../features/order/routes/order.user.routes.js";
import authRoutes from "../features/auth/auth.routes.js";
import productAdminRoutes from "../features/product/product.routes.admin.js";
import cashierOrderRoutes from "../features/order/routes/order.cashier.routes.js";
import voucherRoutes from "../features/voucher/voucher.routes.js";
import paymentRoutes from "../features/payment/payment.routes.js";
import { safeGuard } from "../middlewares/safeGuard.js";
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/orders", orderRoutes);
router.use("/payment", paymentRoutes);

router.use("/cashier/orders", safeGuard("CASHIER"), cashierOrderRoutes);

router.use("/admin/users", safeGuard("ADMIN"), userRoutes);
router.use("/admin/products", safeGuard("ADMIN"), productAdminRoutes);
router.use("/admin/vouchers", safeGuard("ADMIN"), voucherRoutes);

export default router;
