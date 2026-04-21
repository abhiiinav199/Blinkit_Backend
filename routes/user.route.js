import {Router} from 'express';
import { forgotPasswordController, loginController, logoutController, refreshTokenController, registerUserController, resetPasswordController, uploadAvatarController, uploadUserDetailsController, userDetails, verifyEmailController, verifyForgotPasswordOtp } from '../controllers/user.controller.js';
import { auth } from '../middleware/auth.js';
import { upload } from '../middleware/multer.js';

const userRouter = Router()

userRouter.post('/register', registerUserController)
userRouter.post('/verify-email', verifyEmailController)
userRouter.post('/login', loginController)
userRouter.get('/logout',auth, logoutController)
userRouter.put('/upload-avatar', auth, upload.single('avatar') , uploadAvatarController)
userRouter.put('/upload-details', auth, uploadUserDetailsController)
userRouter.put('/forgot-password', forgotPasswordController)
userRouter.put('/verify-forgot-password-otp', verifyForgotPasswordOtp)
userRouter.put('/reset-password', resetPasswordController)
userRouter.post('/refresh-token', refreshTokenController)
userRouter.get('/user-details', auth , userDetails)


export default userRouter