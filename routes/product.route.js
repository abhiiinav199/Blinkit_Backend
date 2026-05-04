import { Router } from "express";
import { createProductController, deleteProductController, getProductByCategory, getProductBySubCategory, getProductController } from "../controllers/product.controller.js";
import { auth } from "../middleware/auth.js";

const productRouter= Router()

productRouter.post("/create",auth,createProductController)
productRouter.post("/get",getProductController)
productRouter.delete("/delete",deleteProductController)
productRouter.post("/get-product-by-category", getProductByCategory)
productRouter.post("/get-product-by-category-and-subcategory", getProductBySubCategory)
export default productRouter