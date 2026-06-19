import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { cashOnDeliveryOrderController, paymentController, webhookStripe } from "../controllers/order.controller.js";

const orderRouter= Router()

orderRouter.post("/cash-on-delivery", auth, cashOnDeliveryOrderController)
orderRouter.post("/checkout", auth, paymentController)
orderRouter.post("/webhook", webhookStripe)


export default orderRouter