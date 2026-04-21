import SubCategoryModel from "../Models/subCategory.model.js";

export const addSubCategoryController = async (req, res) => {
  try {
    const { name, image, category } = req.body;
    if (!name && !image && !category[0]) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const subCategory = new SubCategoryModel({ name, image, category });
    await subCategory.save();
    res
      .status(201)
      .json({
        success: true,
        error: false,
        message: "Sub Category created successfully",
        data: subCategory,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to add sub category",
        error: error.message || error,
      });
  }
};


export const getSubCategoryController = async (req, res) => {
    try {
        const subCategory = await SubCategoryModel.find().sort({ createdAt: -1 }).populate("category")
        if (!subCategory) {
            return res.status(404).json({
                success: false,
                message: "Sub Category not found",
            })
        }
        res.status(200).json({
            success: true,
            error: false,
            data: subCategory,
        })
    } catch (error) {
       return res.status(500).json({
            success: false,
            message: "Failed to get sub category", 
            error: error.message || error,
        })
    }
}

export const updateSubCategoryController = async (req, res) => {
    try {
        const { _id, name, image, category } = req.body
        if(!_id){
            return res.status(400).json({
                success: false,
                message: "Sub Category ID is required",
            })
        }
        const subCategory = await SubCategoryModel.findById(_id)
        if(!subCategory){
            return res.status(404).json({
                success: false,
                message: "Sub Category not found",
            })
        }

        //not recommended way for industry standards
        // subCategory.name = name || subCategory.name
        // subCategory.image = image || subCategory.image
        // subCategory.category = category || subCategory.category
        // await subCategory.save()

        const updateSubCategory= await SubCategoryModel.findByIdAndUpdate(_id,{
          name,
          image,
          category
        },{new:true})
        res.status(200).json({
            success: true,
            error: false,
            message: "Sub Category updated successfully",
            data: updateSubCategory,
        })
    } catch (error) {
       return res.status(500).json({
            success: false,
            message: error.message || error, 
            error: true
        })
    }
}

export const deleteSubCategoryController = async(req, res) =>{
  try {
    const {_id} = req. body
    if(!_id){
      return res.status(400).json({
        success: false,
        message: "Sub Category ID is required",
      })
    }
    const subCategory = await SubCategoryModel.findById(_id)
    if(!subCategory){
      return res.status(404).json({
        success: false,
        message: "Sub Category not found",
      })
    }
    const deletedSubCategory = await SubCategoryModel.findByIdAndDelete(subCategory._id)
    res.status(200).json({
      success: true,
      error: false,
      message: "Sub Category deleted successfully",
      data: deletedSubCategory,
    })
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || error,
      error: true
    })
  }
}