import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { cashOnDeliveryOrderController, paymentController } from "../controllers/order.controller.js";

const orderRouter= Router()

orderRouter.post("/cash-on-delivery", auth, cashOnDeliveryOrderController)
orderRouter.post("/checkout", auth, paymentController)


export default orderRouter