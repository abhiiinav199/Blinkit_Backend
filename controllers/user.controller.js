import { sendEmail } from "../config/sendEmail.js"
import UserModel from "../Models/user.model.js"
import bcryptjs from 'bcryptjs'
import { verifyEmailTemplate } from "../utils/verifyEmailTemplate.js"
import { generateAccessToken } from "../utils/generateAccessToken.js"
import { generateRefreshToken } from "../utils/generateRefreshToken.js"
import { uploadImageCloudinary } from "../utils/uploadImageCloudinary.js"
import { generateOtp } from "../utils/genreateOtp.js"
import { forgotPasswordTemplate } from "../utils/forgotPasswordTemplate.js"
import jwt from "jsonwebtoken"
import { hashingPassword } from "../utils/HashingPassword.js"


export const registerUserController = async (req, res) => {
    try {
        
        const { name, email, password } = req.body || {}
        // validation
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "provide email, password and name",
                error: true,
                success: false
            })
        }
        // check user already register or not
        const user = await UserModel.findOne({ email })
        if (user) {
            return res.json({
                message: "Already register email",
                error: true,
                success: false
            })
        }

        // hash password
        const hashPassword = await hashingPassword(password)
        // const salt = await bcryptjs.genSalt(10)
        // const hashPassword = await bcryptjs.hash(password, salt)

        const payload = {
            name,
            email,
            password: hashPassword
        }

        const newUser = new UserModel(payload)
        const savedUser = await newUser.save()

        const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${savedUser?._id}`

        const verifyEmail = await sendEmail({
            sendTo: email,
            subject: "Verify your email",
            html: verifyEmailTemplate({
                name,
                url: verifyEmailUrl
            })
        })
        return res.status(201).json({
            message: "User register successfully",
            error: false,
            success: true,
            data: savedUser
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const verifyEmailController = async (req, res) => {
    try {
        const { code } = req.body

        const user = await UserModel.findOne({ _id: code })

        if (!user) {
            return res.status(400).json({
                message: "Invalid Code",
                error: true,
                success: false
            })
        }

        const updateUser = await UserModel.updateOne({ _id: code }, {
            verify_email: true
        })

        return res.json({
            message: "Email verified successfully",
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



//login controller
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body || {}

        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide email and password",
                error: true,
                success: false
            });
        }

        //check user
        const user = await UserModel.findOne({ email })

        //check user is registered or not
        if (!user) {
            return res.status(400).json({
                message: "User not registered",
                error: true,
                success: false 
            })
        }
        //check user status is active or not
        if (user.status !== "Active") {
            return res.status(400).json({
                message: "Contact to Admin",
                error: true,
                success: false
            })
        }
        //compare password using bcryptjs
        const checkPassword = await bcryptjs.compare(password, user.password)
        if (!checkPassword) {
            return res.status(400).json({
                message: "Check your username & password",
                error: true,
                success: false
            })
        }
        //generate access token and sending user id in payload
        const accessToken = await generateAccessToken(user._id)

        //generate refresh token and sending user id in payload
        const refreshToken = await generateRefreshToken(user._id)

        const updateUser= await UserModel.findByIdAndUpdate(user?._id,{
            last_login_date : new Date()
        }) 

        //cookies options mandatory
        const cookiesOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        }
        ///set acccess token in cookies
        res.cookie('accessToken', accessToken, cookiesOptions)
        ///set refresh token in cookies
        res.cookie('refreshToken', refreshToken, cookiesOptions)

        //return response
        return res.status(200).json({
            message: "Login successfully",
            error: false,
            success: true,
            data: {
                accessToken,
                refreshToken
            }
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


//logout controller
export const logoutController = async (req, res) => {
    try {
        const userId = req.userId //accessing userId from middleware
        const cookiesOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }
        res.clearCookie('accessToken', cookiesOptions);
        res.clearCookie('refreshToken', cookiesOptions);

        const removeRefreshToken = await UserModel.findByIdAndUpdate(userId, {
            refresh_token: ""
        })
        return res.status(200).json({
            message: "Logout successfully",
            error: false,
            success: true
        })

    } catch (error) {
        return res.status(400).json({
            message: error.meesage || error,
            error: true,
            success: false
        })
    }
}


//upload user avatar
export const uploadAvatarController = async (req, res) => {
    try {
        const userId = req.userId //auth middleware
        const image = req.file // multer middleware

        const upload = await uploadImageCloudinary(image)

        // console.log(upload)


        const updateUser = await UserModel.findByIdAndUpdate(userId, {
            avatar: upload.url
        })

        return res.json({
            message: "upload profile",
            error: false,
            success: true,
            data: {
                _id: userId,
                avatar: upload.url
            }
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


//update user details
export const uploadUserDetailsController = async (req, res) => {
    try {
        const userId = req.userId //auth middleware
        const { name, email, mobile, password } = req.body

        let hashPassword = ""
        if (password) {

               hashPassword = await hashingPassword(password)
            // const salt = await bcryptjs.genSalt(10)
            // hashPassword = await bcryptjs.hash(password, salt)
        }

        const updateUser = await UserModel.findByIdAndUpdate(userId, {
            ...(name && { name: name }),
            ...(email && { email: email }),
            ...(mobile && { mobile: mobile }),
            ...(password && { password: hashPassword }),
        }, { new: true })


        // another way of updating user using updateOne: updateOne(filter, update) always send (_id) in filter and dont need to send (new:true) in updateOne
        // const updatedUser = await UserModel.updateOne({_id: userId}, {
        //     ...(name && { name: name }),
        //     ...(email && { email: email }),
        //     ...(mobile && { mobile: mobile }),
        //     ...(password && { password: hashPassword }),
        // })


        return res.json({
            message: "Updated User Successfully",
            error: false,
            success: true,
            data: updateUser
        })


    } catch (error) {
        res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


//forgot password controller
export const forgotPasswordController = async (req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            res.status(400).json({
                message: "Provide email",
                error: true,
                success: false
            })
        }
        // finding user
        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(400).json({
                message: "User not found",
                error: true,
                success: false
            })
        }

        //generate otp
        const otp = generateOtp()
        const expireOtpTime = new Date(Date.now() + 60 * 60 * 1000)

   

        const update = await UserModel.findByIdAndUpdate(user._id, {
            forgot_password_otp: otp,
            forgot_password_expiry: expireOtpTime    //new Date(expireOtpTime).toISOString() ||
        })

        await sendEmail({
            sendTo: email,
            subject: "Forgot passwrod from Blinkeyit",
            html: forgotPasswordTemplate({
                name: user.name,
                otp: otp
            }),
        })

        return res.json({
            message: "OTP sent successfully, Check your Email",
            error: false,
            success: true,
        })




    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//verify forgot password otp
export const verifyForgotPasswordOtp = async (req, res) => {
    try {
        const { email, otp } = req.body
        if (!email || !otp) {
            return res.status(400).json({
                message: "Provide email and otp",
                error: true,
                success: false
            })
        }
        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(400).json({
                message: "User not found",
                error: true,
                success: false
            })
        }

        const currentTime = new Date()

        if (user.forgot_password_expiry < currentTime) {
            return res.status(400).json({
                message: "Otp is expired",
                error: true,
                success: false
            })
        }

        if (otp !== user.forgot_password_otp) {
            return res.status(400).json({
                message: "Invalid Otp",
                error: true,
                success: false
            })
        }
        // if is otp is not expired
        // otp === user.forgot_password
        const updateUser = await UserModel.findByIdAndUpdate(user._id,{
            forgot_password_otp:"",
            forgot_password_expiry:""
        },{new:true})
        // console.log(updateUser)
        return res.json({
            message: "Verify otp successfully",
            error: false,
            success: true
        })
    } catch (error) {
        res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }

}


//reset the password
export const resetPasswordController = async (req, res) =>{
    try {
        const userId = req.userId
        const { email, newPassword, confirmPassword } = req.body
        if(!email || !newPassword || !confirmPassword){
            return res.status(400).json({
                message: "Provide required fields email, newPassword, confirmPassword",
                error: true,
                success: false
            })
        }

        const user = await UserModel.findOne({email})
        if(!user){
            return res.status(400).json({
                message: "User not found",
                error: true,
                success: false
            })
        }

        if(newPassword !== confirmPassword){
            return res.status(400).json({
                message: "Password does not match, Please try again",
                error: true,
                success: false
        })
    }   

    const hashPassword = await hashingPassword(newPassword)
    // const salt = await bcryptjs.genSalt(10)
    // const hashPassword = await bcryptjs.hash(newPassword, salt)

    const update = await UserModel.findOneAndUpdate(user._id,{
        password: hashPassword
    })
    return res.json({
        message: "Password reset successfully",
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


//refresh token controller
export const refreshTokenController = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken || req?.headers?.authorization?.split(" ")[1]

        if(!refreshToken){
            return res.status(401).json({
                message: "Invalid token",
                error: true,
                success: false
            })
        }
        // console.log("refreshToken:"+ refreshToken )
        const verifyToken = await jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN )

        if(!verifyToken){
            return res.status(401).json({
                message:"token is expired",
                error:true,
                success:false
            })
        }
        const userId = verifyToken?.id
        
        const newAccessToken = await generateAccessToken(userId)

        const cookiesOptions ={
            httpOnly:true,
            secure:true,
            sameSite:"None"   
        }
        res.cookie('accessToken', newAccessToken, cookiesOptions)

        return res.json({
            message: "New access token generated",
            error:false,
            success:true,
            data: {
                accessToken : newAccessToken
            }

        })


        
        
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//get login user details
export const userDetails = async(req, res) =>{
    try {
        const userId = req.userId
        const user = await UserModel.findById(userId).select("-password -refresh_token")    

        if(!user){
            return res.status(400).json({
                message: "User not found",
                error: true,
                success: false
            })
        }
        return res.json({
            message: "User details",
            data: user,
            error: false,
            success: true,
        })
        
    } catch (error) {
        res.status(500).json({
            message : error.message || error,
            error: true,
            success: false
        })
        
    }
}















