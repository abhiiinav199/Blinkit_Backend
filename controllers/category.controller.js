import CategoryModel from "../Models/category.model.js"
import SubCategoryModel from "../Models/subCategory.model.js"
import ProductModel from "../Models/product.model.js"

export const addCategoryController = async (req, res) => {
    try {
        const { name, image } = req.body
        if (!(name || image)) {
            return res.json({
                message: "Enter Required Fields",
                succes: true,
                error: false
            })
        }

        const addCategory = new CategoryModel({
            name,
            image
        })

        const saveCategory = await addCategory.save()

        if (!saveCategory) {
            return res.status(500).json({
                MessageChannel: "Not Created",
                error: true,
                succes: false
            })
        }
        return res.json({
            message: "Added Category",
            success: true,
            error: false
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const getAllcategory = async (req, res) => {
    try {
        const data = await CategoryModel.find().sort({ createdAt: 1 })

        return res.json({
            data: data,
            error: false,
            success: true
        })


    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const updateCategoryController = async (req, res) => {
    try {
        const { _id, name, image } = req.body

        const update = await CategoryModel.updateOne({
            _id: _id
        }, {
            name,
            image
        })

        return res.json({
            message: "Updated Category",
            success: true,
            error: false,
            data: update
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const deleteCategoryController = async (req, res) => {
    try {
        const { _id } = req.body 

          // Check if any subcategory uses this category
        const checkSubCategory = await SubCategoryModel.find({
            category: {
                "$in": [_id]  //value  passed in "$in"  should be array
            }
        }).countDocuments() // another way of doing this- await SubCategoryModel.countDocuments({ category: _id });


            // Check if any product uses this category
        const checkProduct = await ProductModel.find({
            category: {
                "$in": [_id]

            }
        }).countDocuments() //  // another way of doing this- const productCount = await ProductModel.countDocuments({ category: _id });


         // If category is in use, stop deletion
        if (checkSubCategory > 0 || checkProduct > 0) {
            return res.status(400).json({
                message: "Category is already in use , can't delete",
                error: true,
                success: false
            })
        }

        const deleteCategory = await CategoryModel.deleteOne({ _id: _id })


        // If no document was deleted (invalid ID)
        if (deleteCategory.deletedCount === 0) {
            return res.status(404).json({
                message: "Category not found",
                error: true,
                success: false
            });
        }

            // Success response
            return res.json({
                message: "Deleted Category Successfully",
                data: deleteCategory,
                error: false,
                success: true
            })

        } catch (error) {
            return res.status(500).json({
                message: error.message || error,
                error: true,
                success: false
            })
        }
    }

    