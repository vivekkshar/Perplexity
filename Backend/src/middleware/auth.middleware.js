import jwt from "jsonwebtoken"

export async  function  authUser(req,res,next){

    const token = req.cookies.authToken || req.headers.authorization?.split(" ")[1]
    console.log(token)

    if(!token){
        return res.status(401).json({
            message: "token not found",
            success:false,

        })
    }

    

    try {
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        req.user = decoded
        next()
        
    } catch (error) {
        return res.status(401).json({
            message: "invalid credentials",
            success:false,    
            error: error.message
    })
}

}