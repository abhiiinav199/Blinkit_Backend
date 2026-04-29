import { Router } from "express";
import { createProductController, deleteProductController, getProductByCategory, getProductController } from "../controllers/product.controller.js";
import { auth } from "../middleware/auth.js";

const productRouter= Router()

productRouter.post("/create",auth,createProductController)
productRouter.post("/get",getProductController)
productRouter.delete("/delete",deleteProductController)
productRouter.post("/get-product-by-category", getProductByCategory)


export default productRouter