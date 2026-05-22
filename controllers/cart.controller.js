import CartProductModel from "../Models/cartproduct.model.js"
import UserModel from "../Models/user.model.js"

export const addToCartItemController = async (req, res) => {
    try {
        const { userId } = req?.user;
        const { productId } = req?.body;

        if (!productId) {
            return res.status(40).json({
                message: "Provide Product Id",
                error: true,
                success: false
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