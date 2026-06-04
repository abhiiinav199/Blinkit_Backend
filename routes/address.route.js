import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { addAddressController } from "../controllers/address.controller.js";

const addressRouter = Router()

addressRouter.post("/create", auth, addAddressController)

export default addressRouter