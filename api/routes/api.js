import { Router } from "express";
const router = Router();
import ctrlOrders from "../controllers/orders.js";
import healthcheck from "../controllers/healthcheck.js";
import { tenantHealthcheck } from "../controllers/healthcheck.js";

router.post("/:tenant/checkout/:user_id", ctrlOrders.checkout);
router.get("/:tenant/order/:order_id", ctrlOrders.orderReadOne);
router.get("/:tenant/vendor_orders/:seller_id", ctrlOrders.vendorOrders);
router.get("/:tenant/buyer_orders/:buyer_id", ctrlOrders.buyerOrders);
router.post("/:tenant/order", ctrlOrders.orderCreate);
router.put("/:tenant/order/:order_id", ctrlOrders.orderUpdateOne);
router.get("/health", healthcheck);
router.get("/:tenant/health", tenantHealthcheck);



export default router;