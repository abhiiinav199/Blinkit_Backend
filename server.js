import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import connectDB from './config/connectDB.js'
import userRouter from './routes/user.route.js'
import categoryRouter from './routes/category.route.js'
import uploadRouter from './routes/upload.route.js'
import subCategoryRouter from './routes/subCategory.route.js'
import productRouter from './routes/product.route.js'
import cartRouter from './routes/cart.route.js'
import addressRouter from './routes/address.route.js'
import orderRouter from './routes/order.routes.js'


const app = express()
app.use(cors({
    credentials: true,
    
    // origin: [ "URL_ADDRESS:3000" ]
    origin : process.env.FRONTEND_URL 
}))
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))
app.use(helmet({
    crossOriginResourcePolicy : false
}))
const PORT = process.env.PORT || 8080






app.get("/" , (req, res) =>{
        // REVERSING A STRING: JUST FOR PRACTICE
    // function reverseString(str) {
    //     // const newString= str.split(" ").reverse().join("");
    //     console.log(str.split("").reverse().join("").replace(/\s/g, ""))
    //     // console.log(newString);
    // }
    
    // reverseString("Home Root TREE") 
    // res.json({
    //     message: "Hello World"
    // })

})


app.use('/api/user', userRouter)
app.use("/api/category", categoryRouter)
app.use("/api/file", uploadRouter)
app.use("/api/subcategory", subCategoryRouter)
app.use("/api/product", productRouter)
app.use("/api/cart", cartRouter)
app.use("/api/address", addressRouter)
app.use("/api/order", orderRouter)
// const expireOtpTime = new Date().getTime() +60 *60 *1000
// console.log(expireOtpTime)
const startServer= async () =>{
    try {
        await connectDB()
         app.listen(PORT, () =>{
            console.log(`Server running on port ${PORT}`)
        })
    } catch (error) {
        console.log("Failed to connect to db:" ,error);
        process.exit(1)
    }
}
startServer()
// connectDB().then(() =>{
//     app.listen(PORT , () =>{
//         console.log(`Server running on port ${PORT}`)
//     })
// })

