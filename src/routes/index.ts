import express from "express";
import userRoutes from "../features/user/user.routes.js";
import orderRoutes from "../features/order/routes/order.user.routes.js";
import authRoutes from "../features/auth/auth.routes.js";
import productAdminRoutes from "../features/product/routes/product.routes.admin.js";
import cashierOrderRoutes from "../features/order/routes/order.cashier.routes.js";
import voucherRoutes from "../features/voucher/voucher.routes.js";
import paymentRoutes from "../features/payment/payment.routes.js";
import productFreeRoutes from "../features/product/routes/product.routes.free.js";
import overviewRoutes from "../features/overview/overview.routes.js";
import historyRoutes from "../features/history/history.routes.js";
import cashierProuctRoutes from "../features/product/routes/product.routes.cashier.js";
import { safeGuard } from "../middlewares/safeGuard.js";
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/orders", orderRoutes);
router.use("/payment", paymentRoutes);
router.use("/products", productFreeRoutes);

router.use("/cashier/orders", safeGuard("CASHIER"), cashierOrderRoutes);
router.use("/cashier/products", safeGuard("CASHIER"), cashierProuctRoutes);

router.use("/admin/users", safeGuard("ADMIN"), userRoutes);
router.use("/admin/products", safeGuard("ADMIN"), productAdminRoutes);
router.use("/admin/vouchers", safeGuard("ADMIN"), voucherRoutes);
router.use("/admin/overview", safeGuard("ADMIN"), overviewRoutes);
router.use("/admin/history", safeGuard("ADMIN"), historyRoutes);

export default router;
