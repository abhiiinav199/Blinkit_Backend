import { Router } from "express";
import { createProductController, deleteProductController, getProductController } from "../controllers/product.controller.js";
import { auth } from "../middleware/auth.js";

const productRouter= Router()

productRouter.post("/create",auth,createProductController)
productRouter.post("/get",getProductController)
productRouter.delete("/delete",deleteProductController)
export default productRouter