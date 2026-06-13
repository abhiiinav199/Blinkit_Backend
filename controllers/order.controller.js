import mongoose from "mongoose"
import OrderModel from "../Models/order.model.js"
import CartProductModel from "../Models/cartproduct.model.js"
import UserModel from "../Models/user.model.js"

export const cashOnDeliveryOrderController = async (req, res) =>{
    try {
        const {userId} = req //middleware
        const {list_items, totalAmt, addressId, subTotalAmt} = req.body
        console.log("list_items", list_items);
        

        const payload = list_items.map((item) =>{
            return {
                userId : userId,
                orderId: `ORD-${new mongoose.Types.ObjectId()}`, //custom orderId making using mongoose ObjectId-example ORD-64b8c9f1e1d3c2a5f0e4b8a, ORD-6850fca1f0f4d4f2c9f8a123
                productId: item.productId._id,
                productDetails:{
                    name : item.productId.name,
                    image : item.productId.image,
                },
                paymentId : "",
                payment_status :"CASH ON DELIVERY",
                delivery_address : addressId,
                subTotalAmt :subTotalAmt,
                totalAmt : totalAmt,
            }
        })

        const generatedOrder =  await OrderModel.insertMany(payload)

        //remove from cart after order placed
        const removeCartItem = await CartProductModel.deleteMany({
            userId : userId
        })
        //empty shopping cart in user model
        const updateInUser = await UserModel.updateOne({_id: userId},{
            shopping_cart : []
        })

        return res.status(200).json({
            success: true,
            message: "Order placed successfully with cash on delivery",
            orderDetails : generatedOrder
        })


    } catch (error) {
        return res.status(500).json({
            error: true,
            success: false,
            message: error.message || error,
        })
    }
}



const priceWithDiscount = (price,dis = 1)=>{
    price = Number(price)
    dis = Number(dis)

    const discountAmount = Math.ceil(price * dis / 100)
    const actualPrice = price - discountAmount
    return actualPrice
}


export const paymentController =async (req, res) =>{
    try {
         const {userId} = req //middleware
        const {list_items, totalAmt, addressId, subTotalAmt} = req.body
        console.log("list_items", list_items);

        const line_items= list_items.map((item) => {
            return{
               price_data:{
                currency : "inr",
                product_data:{
                    name : item.productId.name,
                    images : [item.productId.image],
                    metadata:{
                        productId : item.productId._id
                    }
                },
                unit_amount : priceWithDiscount(item.productId.price, item,productId.dicount) //in paise
               } 
            }
        })

        
    } catch (error) {
        return res.status(500).json({
            error: true,
            success:false,
            message: error.message || error
        })
    }
}