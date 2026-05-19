import mongoose from 'mongoose'

const productSchema = mongoose.Schema({
    name: {
        type: String,
    },
    image:{
        type: Array,
        default: [],
    },
    category : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref :"category"
        }
    ],
    subCategory: [
        {
        type :mongoose.Schema.Types.ObjectId,
        ref: "subCategory"
        }
],
    unit: {
        type: String,
        default : ""
    },
    stock: {
        type: Number,
        default : null,
    },
    price: {
        type : Number,
        default: null,
    },
    discount: {
        type: Number,
        default: null,
    },
    description: {
        type: String,
        default: null,
    },
    more_details :{
        type: Object,
        default: {}
    },
    publish:{
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true
})


//create a text index
productSchema.index({ 
    name: "text",
    description: "text" 

},{
    name: 10,
    description: 5
})

const ProductModel = mongoose.model("product", productSchema)

export default ProductModel;