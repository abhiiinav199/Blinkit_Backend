export const generateOtp = () =>{
    return Math.floor(Math.random() * 900000 )+100000 //100000 to 900000
}