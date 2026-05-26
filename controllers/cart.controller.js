import CartProductModel from "../Models/cartproduct.model.js"
import UserModel from "../Models/user.model.js"

export const addToCartItemController = async (req, res) => {
    try {
        const { userId } = req;
        const { productId } = req?.body;

        if (!productId) {
            return res.status(40).json({
                message: "Provide Product Id",
                error: true,
                success: false
            })
        }
        
        const checkCartItem = await CartProductModel.findOne({
            userId: userId,
            productId: productId
        })
        if(checkCartItem){
            return res.status(400).json({
                message:"Product already in cart",
                error:true,
                success:false
            })
        }
        const cartItem = await CartProductModel.create({
            quantity: 1,
            userId: userId,
            productId: productId
        })
        const updateCartUser= await UserModel.updateOne({_id: userId},{
            $push:{shopping_cart: productId}
        })
        
        return res.status(200).json({
            message:"Product added to cart",
            error:false,
            success:true,
            data:cartItem,
            updateCartUser 
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const getCartItemController = async (req, res)=>{
    try {
        const {userId} = req;

        const cartItem = await CartProductModel.find({
            userId: userId
        }).populate("productId")

        return res.status(200).json({
            error:false,
            success:true,
            data:cartItem
        })
        
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const updateCartItemController = async(req, res) =>{
    try {
        const {userId} = req;
        const {_id, qty} = req?.body;
        if(!_id || !qty){
            return res.status(400).json({
                message:"Provide Product Id and Quantity",
                error:true,
                success:false
            })
        }
        
        const updateCartItem =await CartProductModel.updateOne({
            _id: _id
        },{
            quantity: qty
        })
        return res.status(200).json({
            data: updateCartItem,
            error:false,
            success:true
        })
    } catch (error) {
         return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}