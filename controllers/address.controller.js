import AddressModel from "../Models/address.model.js";
import UserModel from "../Models/user.model.js"

export const addAddressController = async (req, res) => {
    try {
        const { userId } = req  //middleware
        const { address_line, city, state, country, pincode, mobile } = req?.body
        if (!address_line || !city || !state || !country || !pincode || !mobile) {
            return res.status(400).json({
                message: "All fields are required",
                error: true,
                success: false
            })
        }

        const createAddress = await AddressModel.create({
            address_line,
            city,
            state,
            country,
            pincode,
            mobile,
            userId: userId
        })

        const addAddressUserId = await UserModel.findByIdAndUpdate(userId, { $push: { address_details: createAddress._id } })

        return res.status(201).json({
            message: "Address added successfully",
            error: false,
            success: true,
            data: createAddress
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || error
        })
    }
}


export const getAddressController = async (req, res) => {
    try {

        const { userId } = req

        const data = await AddressModel.find({ userId: userId })

        return res.json({
            data: data,
            success: true,
            error: false,
            message: "List of Address"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || error
        })
    }
}

export const updateAddressController = async (req, res) => {
    try {
        const { userId } = req // middleware
        const { _id, address_line, city, state, country, pincode, mobile } = req.body

        const updateAdress = await AddressModel.updateOne({ _id: _id, userId: userId }, {
            address_line,
            city,
            state,
            country,
            pincode,
            mobile
        }
        )

        return res.status(201).json({
            message: "Updated Address",
            error: false,
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || error
        })
    }
}