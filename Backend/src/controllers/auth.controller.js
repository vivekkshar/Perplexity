import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken"



export async function registercontroller(req,res){
    const {username,email,password} = req.body;

    try {
        // Check if user already exists
        const isuseralreadyexists = await userModel.findOne({ 
            $or: [{ email }, { username }] 
        });

        if (isuseralreadyexists) {
            return res.status(409).json({
                success:false,
                message: "User with this email or username already exists",
                err:"user already exists"
            });
        }

        const user = await userModel.create({
            username,
            email,
            password
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                verified: user.verified
            }
        });
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error registering user",
            error: error.message
        });
    }
}



export async function logincontroller(req ,res){
    console.log("hii")

}