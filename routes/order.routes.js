import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { cashOnDeliveryOrderController } from "../controllers/order.controller.js";

const orderRouter= Router()

orderRouter.post("/create", auth, cashOnDeliveryOrderController)


export default orderRouter