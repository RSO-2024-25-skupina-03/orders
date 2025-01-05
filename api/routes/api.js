import { Router } from "express";
const router = Router();
import ctrlOrders from "../controllers/orders.js";
import healthcheck from "../controllers/healthcheck.js";

router.post("/checkout/:user_id", ctrlOrders.checkout);
router.get("/order/:order_id", ctrlOrders.orderReadOne);
router.get("/vendor_orders/:seller_id", ctrlOrders.vendorOrders);
router.get("/buyer_orders/:buyer_id", ctrlOrders.buyerOrders);
router.post("/order", ctrlOrders.orderCreate);
router.put("/order/:order_id", ctrlOrders.orderUpdateOne);
router.get("/health", healthcheck);


export default router;