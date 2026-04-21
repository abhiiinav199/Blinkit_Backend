import { Router } from "express";
import { addCategoryController, deleteCategoryController, getAllcategory, updateCategoryController } from "../controllers/category.controller.js";
import { auth } from "../middleware/auth.js";

const categoryRouter = Router()

categoryRouter.post("/add-category" , auth , addCategoryController)
categoryRouter.get("/get" , getAllcategory)
categoryRouter.put("/update", auth, updateCategoryController)
categoryRouter.delete("/delete", auth, deleteCategoryController)

export default categoryRouter
