import "dotenv/config"
import userModel from "../models/user.model.js";
import sendEmail from "../services/mail.services.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs" 

// Validate JWT_SECRET is set
if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set");
}



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

        const emailverificationtoken = jwt.sign({
            email:user.email
        } , process.env.JWT_SECRET)

        await sendEmail({
            to: email,
            subject:"welcome to perplexity ",
            html: `<h1>Welcome to Perplexity, ${username}!</h1>
            <p>Thank you for registering with us. We're excited to have you on board!</p>
            <p>Please verify your email address by clicking the link below:</p>
            <a href="http://localhost:8000/api/auth/verify-email?token=${emailverificationtoken}">Verify Email</a>
            <p>Best regards,
            <br/>
            The Perplexity Team</p>`
        })



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


export async function verifyemail(req, res){
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({
                message: "Token is required",
                success: false
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findOne({ email: decoded.email });

        if (!user) {
            return res.status(404).json({
                message: "invalid token",
                success: false,
                error: "user not found"
            });
        }

        user.verified = true;
        await user.save();

        res.status(200).json({
            success: true,
            message: "email verified successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            message: "Invalid or expired token",
            success: false,
            error: error.message
        });
    }
}

export async function getmecontroller(req, res){
    const userid = req.user.id 
    
    const user =  await userModel.findById(userid)

    if(!user){
        return res.status(401).json({
            message:"user not found",
            success:false
        })
    }
    res.status(200).json({
        message:"user fetched successfully",
        user
    })
}



export async function logincontroller(req, res) {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
                error: "Missing credentials"
            });
        }

        // Find user by email
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
                error: "User not found"
            });
        }

        // Check if email is verified
        if (!user.verified) {
            return res.status(403).json({
                success: false,
                message: "Please verify your email first",
                error: "Email not verified"
            });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
                error: "Password mismatch"
            });
        }

        // Generate JWT access token
        const accessToken = jwt.sign(
            { userId: user._id, email: user.email, username: user.username },
            process.env.JWT_SECRET
        );

        // Set token in cookie 
        res.cookie('authToken', accessToken);

        res.status(200).json({
            success: true,
            message: "Login successful",
            accessToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                verified: user.verified
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Error during login",
            error: error.message
        });
    }
}