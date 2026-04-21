// import { v2 as cloudinary } from 'cloudinary'

// // this hook is currently not in use
// cloudinary.config({
//     cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
//     api_key : process.env.CLOUDINARY_API_KEY,
//     api_secret : process.env.CLOUDINARY_API_SECRET
// })

// export const deleteImageCloudinary = async (publicId) => {
//     try {
//         const result = await cloudinary.uploader.destroy(publicId)
//         return result
//     } catch (error) {
//         return null
//     }
// }