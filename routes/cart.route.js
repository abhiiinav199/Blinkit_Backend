import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { addToCartItemController } from "../controllers/cart.controller.js";


const cartRouter = Router()

cartRouter.post("/add-to-cart", auth, addToCartItemController)



export default cartRouter;