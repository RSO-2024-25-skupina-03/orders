import { Router } from "express";
const router = Router();
import ctrlOrders from "../controllers/orders.js";
import healthcheck from "../controllers/healthcheck.js";

router.post("/checkout/:userId", ctrlOrders.checkout);
router.get("/order/:orderId", ctrlOrders.orderReadOne);
router.get("/vendor_orders/:vendorId", ctrlOrders.vendorOrders);
router.get("/buyer_orders/:buyerId", ctrlOrders.buyerOrders);
router.post("/order", ctrlOrders.orderCreate);
router.put("/order/:orderId", ctrlOrders.orderUpdateOne);
router.get("/health", healthcheck);


export default router;