import { Router } from 'express';
import { messagecontroller, getchatscontroller, getmessagescontroller, deletechatcontroller } from '../controllers/chat.controller.js';
import { authUser } from '../middleware/auth.middleware.js'

const chatRouter = Router()

chatRouter.post("/message", authUser, messagecontroller )
chatRouter.get("/", authUser, getchatscontroller)
chatRouter.get("/:chatId/getmessages", authUser, getmessagescontroller)
chatRouter.delete("/:chatId", authUser, deletechatcontroller)



export default chatRouter;

