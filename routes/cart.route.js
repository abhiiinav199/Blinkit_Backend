import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { addToCartItemController, getCartItemController, updateCartItemController } from "../controllers/cart.controller.js";


const cartRouter = Router()

cartRouter.post("/create", auth, addToCartItemController)
cartRouter.get("/get", auth, getCartItemController)
cartRouter.put("/update-qty", auth, updateCartItemController)



export default cartRouter; 