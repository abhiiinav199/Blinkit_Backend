import mongoose from "mongoose"
import OrderModel from "../Models/order.model.js"
import CartProductModel from "../Models/cartproduct.model.js"
import UserModel from "../Models/user.model.js"
import Stripe from "../config/stripe.js"
import dotenv from 'dotenv';
dotenv.config();

export const cashOnDeliveryOrderController = async (req, res) => {
    try {
        const { userId } = req //middleware
        const { list_items, totalAmt, addressId, subTotalAmt } = req.body
        console.log("list_items", list_items);


        const payload = list_items.map((item) => {
            return {
                userId: userId,
                orderId: `ORD-${new mongoose.Types.ObjectId()}`, //custom orderId making using mongoose ObjectId-example ORD-64b8c9f1e1d3c2a5f0e4b8a, ORD-6850fca1f0f4d4f2c9f8a123
                productId: item.productId._id,
                productDetails: {
                    name: item.productId.name,
                    image: item.productId.image,
                },
                paymentId: "",
                payment_status: "CASH ON DELIVERY",
                delivery_address: addressId,
                subTotalAmt: subTotalAmt,
                totalAmt: totalAmt,
            }
        })

        const generatedOrder = await OrderModel.insertMany(payload)

        //remove from cart after order placed
        const removeCartItem = await CartProductModel.deleteMany({
            userId: userId
        })
        //empty shopping cart in user model
        const updateInUser = await UserModel.updateOne({ _id: userId }, {
            shopping_cart: []
        })

        return res.status(200).json({
            success: true,
            message: "Order placed successfully with cash on delivery",
            orderDetails: generatedOrder
        })


    } catch (error) {
        return res.status(500).json({
            error: true,
            success: false,
            message: error.message || error,
        })
    }
}



const priceWithDiscount = (price, dis = 1) => {
    price = Number(price)
    dis = Number(dis)

    const discountAmount = Math.ceil(price * dis / 100)
    const actualPrice = price - discountAmount
    return actualPrice
}


export const paymentController = async (req, res) => {
    try {
        const { userId } = req //middleware
        const { list_items, totalAmt, addressId, subTotalAmt } = req.body

        const user = await UserModel.findById(userId)

        const line_items = list_items.map((item) => {
            const unitAmount = priceWithDiscount(item.productId.price, item.productId.discount) * 100

            return {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: item.productId.name,
                        images: item.productId.image,
                        metadata: {
                            productId: item.productId._id
                        }
                    },
                    unit_amount: unitAmount  //in paise
                },
                adjustable_quantity: {
                    enabled: true,
                    minimum: 1
                },
                quantity: item.quantity
            }
        })


        const params = {
            submit_type: "pay",
            mode: "payment",
            payment_method_types: ["card"],
            customer_email: user.email,
            metadata: {
                userId: userId,
                addressId: addressId
            },
            line_items: line_items,
            success_url: `${process.env.FRONTEND_URL}/success`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`
        }

        const session = await Stripe.checkout.sessions.create(params)

        return res.status(200).json(session)
    } catch (error) {
        return res.status(500).json({
            error: true,
            success: false,
            message: error.message || error
        })
    }
}


const getOrderProductItem = async ({ lineItems, userId, addressId, paymentId, payment_status }) => {
    const productList = []

    if (lineItems?.data?.length > 0) {
        for (const item of lineItems.data) {

            const product = await Stripe.products.retrieve(item.price.product)
            console.log("product", product)
            console.log("item", item)

            const payload = {
                userId: userId,
                orderId: `ORD-${new mongoose.Types.ObjectId()}`,
                productId: product.metadata.productId,
                productDetails: {
                    name: product.name,
                    image: product.images[0],
                },
                paymentId: paymentId,
                payment_status: payment_status,
                delivery_address: addressId,
                subTotalAmt: Number(item.amount_total / 100),
                totalAmt: Number(item.amount_total / 100),
            }

            productList.push(payload)

        }

    }

    return productList
}
//endpoint-  http://localhost:3000/api/order/webhook
export const webhookStripe = async (req, res) => {
    const event = req.body

    const endPointSecret = process.env.STRIPE_ENDPOINT_WEBHOOK_SECRET
    console.log("event", event)


    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;

            const lineItems = await Stripe.checkout.sessions.listLineItems(session.id)

            const userId = session.metadata.userId

            const orderProduct = await getOrderProductItem(
                {
                    lineItems :lineItems, 
                    userId: userId, 
                    addressId: session.metadata.addressId,
                    paymentId: session.payment_intent,
                    payment_status: session.payment_status
                },
                )

            const order = await OrderModel.insertMany(orderProduct)
            

            if (Boolean(order[0])) {
                const removeCartItem = await UserModel.findByIdAndUpdate(userId, {
                    shopping_cart: []
                })
                const removeCartDB = await CartProductModel.deleteMany({userId: userId})
            }

            break;

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    res.json({ received: true });

}

export const getOrderDetailsController = async(request,response)=>{
    try {
        const userId = request.userId // order id

        const orderlist = await OrderModel.find({ userId : userId }).sort({ createdAt : -1 }).populate('delivery_address')

        return response.json({
            message : "order list",
            data : orderlist,
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
} 
