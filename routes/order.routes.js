import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { cashOnDeliveryOrderController } from "../controllers/order.controller.js";

const orderRouter= Router()

orderRouter.post("/cash-on-delivery ", auth, cashOnDeliveryOrderController)


export default orderRouter