import jwt from "jsonwebtoken"

export async  function  authUser(req,res,next){

    const token = req.cookie.token 

    if(!token){
        return res.status(401).json({
            message: "toekn not foud",
            success:false,

        })
    }

    try {
        
        const decoded = jwt.verify(token, processs.env.JWT_SECRET)

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