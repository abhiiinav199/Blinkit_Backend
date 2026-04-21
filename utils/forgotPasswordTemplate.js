export const forgotPasswordTemplate =({name, otp}) =>{
    return `
         <p>Dear ${name},</p>
    <p>Your One-Time Password (OTP) is:</p>
    <h2 style="color: orange; font-size: 24px; letter-spacing: 2px;">${otp}</h2>
    <p>You have requested a password reset. Please use following OTP code 
    <p>This OTP is valid for 1H. Please do not share it with anyone.</p>
    <p>Thank you,<br/>Blinkeyit Team</p>
    `
}