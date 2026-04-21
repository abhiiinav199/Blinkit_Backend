import jwt from "jsonwebtoken"
import UserModel from "../Models/user.model.js"
import dotenv from 'dotenv'
dotenv.config()
export const generateRefreshToken =async (userId) =>{
    const token = await jwt.sign({id : userId}, 
        process.env.SECRET_KEY_REFRESH_TOKEN, 
        {expiresIn: "7d"}
    )
    const updatRefreshToken = await UserModel.updateOne(
        {_id: userId},
        {refresh_token: token}
    )
    return token
}