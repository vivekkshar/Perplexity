import {generateresponse, generatechattitle} from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";    
import messageModel from "../models/message.model.js"

export async function messagecontroller(req, res){
    try {
        const { message, actualChatId:chatId } = req.body;
        if(!message){
            return res.status(400).json({
                success:false,
                message: "Message is required"
            })
        }

        if(!req.user || !req.user.userId){
            return res.status(401).json({
                success:false,
                message: "User not authenticated"
            })
        }
 
        let title = null, chat = null
        

        // If no chatId provided, create a new chat
        if(!chatId){
            title = await generatechattitle(message)
            chat = await chatModel.create({
                user: req.user.userId,
                title: title
            })
        } else {
            chat = await chatModel.findById(chatId)
        }

        const usermessage = await messageModel.create({
            chat: chatId || chat._id,
            content: message,
            role: "user"
        })

        const result = await generateresponse(message)
        const aimessage = await messageModel.create({
            chat: chatId || chat._id,
            content: result,
            role: "ai"
        })

        // Fetch all messages for this chat
        const messages = await messageModel.find({
            chat: chatId || chat._id
        })

        res.json({
            success: true,
            chat,
            messages,
            aimessage,
            usermessage
        })

        
        
    } catch (error) {
            res.status(500).json({
                success:false,
                message: error.message
            })
        }        
} 


export async function getchatscontroller(req, res){
    const user = req.user
    if(!user){
        return res.status(401).json({
            message:"user not authenticated",
            success:false   
        })    
    }


    const chat = await chatModel.find({
        user: user.userId
    })

    res.status(200).json({
        message:"chat fetched succesfully",
        chat
    })

}

export async function getmessagescontroller(req, res){
    const user = req.user
    const { chatId } = req.params

    const chat = await chatModel.findOne({
        _id: chatId,
        user: req.user.id
    })

    if(!chat){
        return res.status(404).json({
            message:"chat not found",
            success:false   
        })    
    }

    if(!user){
        return res.status(401).json({
            message:"user not authenticated",
            success:false   
        })    
    }
    const messages = await messageModel.findById({
        chat: chatId
    })

    res.status(200).json({
        message:"message fetches succesfully ",
        messages
    })
}




