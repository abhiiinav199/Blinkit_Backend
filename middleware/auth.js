import jwt from "jsonwebtoken";


export const auth = async(req, res, next) =>{

    try{
        const token = req.cookies.accessToken || req?.headers?.authorization?.split(" ")[1] //req.cookies.accessToken is for browser and req?.headers.authorization?.split(" ")[1] is for mobile devices which do not support cookies
        if(!token){return res.status(401).json({message: "Provide token"})}

        //verify token and decode it
        const decode = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN)
        if(!decode){
            return res.status(401).json({message: "Unauthorized Access",error:true,success:false})
        }
   

        //set user id so that we can use it in other controllers
        req.userId= decode?.id  
        next()
    }catch(error){
        res.status(500).json({
            message:"You have not logged in", //error.message || error,
            error: true,
            success: false
        })
    }
}