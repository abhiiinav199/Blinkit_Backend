import { Router } from "express";
import { createProductController, deleteProductController, getProductByCategory, getProductBySubCategory, getProductController, getProductDetails, searchProduct, updateProductDetails } from "../controllers/product.controller.js";
import { auth } from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";

const productRouter= Router()

productRouter.post("/create",auth,admin,createProductController)
productRouter.post("/get",getProductController)
productRouter.delete("/delete",deleteProductController)
productRouter.post("/get-product-by-category", getProductByCategory)
productRouter.post("/get-product-by-category-and-subcategory", getProductBySubCategory)

productRouter.post('/get-product-details',getProductDetails)

//update product
productRouter.put('/update-product-details',auth,admin,updateProductDetails)

// search
productRouter.post('/search-product',searchProduct)


export default productRouter