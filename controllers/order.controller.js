

export const cashOnDeliveryOrderController = async (req, res) =>{
    try {
        const userId = req.userId //middleware
        const {list_items, totalAmt, addressId, subTotalAmt} = req.body
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message || error
        })
    }
}