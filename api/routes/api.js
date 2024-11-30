import { Router } from "express";
const router = Router();
import ctrlOrders from "../controllers/orders.js";

router.get("/order/:orderId", ctrlOrders.orderReadOne);
router.get("/vendor_orders/:vendorId", ctrlOrders.vendorOrders);
router.get("/buyer_orders/:buyerId", ctrlOrders.buyerOrders);
router.post("/order", ctrlOrders.orderCreate);
router.put("/order/:orderId", ctrlOrders.orderUpdateOne);


export default router;