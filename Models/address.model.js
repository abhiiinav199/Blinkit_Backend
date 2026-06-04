import mongoose from 'mongoose'

const addrressSchema = new mongoose.Schema({
    address_Line: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        default: ""
    },
    state: {
        type: String,
        default: ""
    },
    pincode: {
        type: String,
    },
    mobile: {
        type: Number,
         default: null
    },
    status: {
        type: Boolean,
        default: "true"
    }
}, {
    timestamps: true
})



const AddressModel = mongoose.model("address", addrressSchema)

export default AddressModel