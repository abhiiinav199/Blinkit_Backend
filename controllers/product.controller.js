import ProductModel from "../Models/product.model.js";
// import { deleteImageCloudinary } from "../utils/deleteImageCloudinary.js"

export const createProductController = async (req, res) => {
  try {
    const {
      name,
      image,
      category,
      subCategory,
      unit,
      stock,
      price,
      discount,
      description,
      more_Details,
    } = req.body;

    if (
      !name ||
      !category[0] ||
      !subCategory[0] ||
      !unit ||
      !stock ||
      !price ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
        error: true,
      });
    }

    const product = await ProductModel.create({
      name,
      image,
      category,
      subCategory,
      unit,
      stock,
      price,
      discount,
      description,
      more_Details,
    });

    //Above code is same as below code. use below code if you want to use custom logic before saving. Ex- You can run custom logic before calling .save(),Better when you need hooks/middleware or validation logic
    //   const product = new ProductModel({
    //     name,
    //     image,
    //     category,
    //     subCategory,
    //     unit,
    //     stock,
    //     price,
    //     discount,
    //     description,
    //     more_Details
    // })
    // const savedProduct = await product.save()
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product not created",
        error: true,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product created successfully",
      error: false,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || error,
      error: true,
    });
  }
};

export const getProductController = async (req, res) => {
  try {
    let { page, limit, search } = req.body;

    if (!page) {
      page = 1;
    }
    if (!limit) {
      limit = 10;
    }

    let query = search
      ? {
        $text: {
          $search: search,
        },
      }
      : {};

    let skip = (page - 1) * limit;
    let [data, totalCount] = await Promise.all([
      ProductModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate("category subCategory"),
      ProductModel.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      error: false,
      totalCount: totalCount,
      totalNoPage: Math.ceil(totalCount / limit),
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || error,
      error: true,
    });
  }
};


export const deleteProductController = async (req, res) => {
  try {
    const { _id } = req.body
    if (!_id) {
      return res.status(400).json({
        success: false,
        message: "Product Id is required",
        error: true
      })
    }
    const product = await ProductModel.findByIdAndDelete(_id)
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product not deleted",
        error: true
      })
    }
    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      error: false,
      data: product
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || error,
      error: true,
    });
  }
}


export const getProductByCategory = async (req, res) => {
  try {
    const { id } = req.body
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Provide Category id",
        error: true
      })
    }
    const product = await ProductModel.find({ category: { $in: id } }).limit(15)

    return res.status(200).json({
      success: true,
      message: "Category products list",
      error: false,
      data: product
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || error,
      error: true
    })
  }
}

export const getProductBySubCategory = async (req, res) => {
  try {
    let { categoryId, subCategoryId, page, limit } = req.body
    if (!categoryId || !subCategoryId) {
      return res.status(400).json({
        success: false,
        message: "Provide Category id and Sub Category id",
        error: true
      })
    }
    if (!page) {
      page = 1
    }
    if (!limit) {
      limit = 10
    }
    const query = {
      category: { $in: categoryId },
      subCategory: { $in: subCategoryId }
    }
    let skip = (page - 1) * limit;
    const [data, dataCount] = await Promise.all([
      ProductModel.find(query).sort({ createdAt: 1 }).skip(skip).limit(limit),
      ProductModel.countDocuments(query)
    ])

    return res.status(200).json({
      message: "Product list",
      data: data,
      totalCount: dataCount,
      pageCeilValue: Math.ceil(dataCount / limit),
      page: page,
      limit: limit,
      success: true,
      error: false
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || error,
      error: true
    })
  }
}

export const getProductDetails = async(req,res)=>{
   try {
        const { productId } = req.body 

        const product = await ProductModel.findOne({ _id : productId })


        return res.json({
            message : "product details",
            data : product,
            error : false,
            success : true
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//update product
export const updateProductDetails = async(req,res)=>{
    try {
        const { _id } = req.body 

        if(!_id){
            return res.status(400).json({
                message : "provide product _id",
                error : true,
                success : false
            })
        }

        const updateProduct = await ProductModel.updateOne({ _id : _id },{
            ...req.body
        })

        return res.json({
            message : "updated successfully",
            data : updateProduct,
            error : false,
            success : true
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

// export const deleteImageController = async (req, res) => {
//     try {
//         const { publicId } = req.body
//         if(!publicId){
//             return res.status(400).json({
//                 success: false,
//                 message: "Public Id is required",
//                 error: true
//             })
//         }
//         const result = await deleteImageCloudinary(publicId)
//         if(!result){
//             return res.status(400).json({
//                 success: false,
//                 message: "Image not deleted",
//                 error: true
//             })
//         }
//         return res.status(200).json({
//             success: true,
//             message: "Image deleted successfully",
//             error: false,
//             data: result
//         })
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message || error,
//             error: true
//         })
//     }
// }
