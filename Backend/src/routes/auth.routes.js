import { Router } from 'express';
import {registercontroller, logincontroller, verifyemail, getmecontroller }from "../controllers/auth.controller.js"
import { registerValidation, loginValidation, validationErrorHandler } from "../validators/auth.validator.js"
import {authUser} from "../middleware/auth.middleware.js"


const router = Router();


router.post('/register', registerValidation, validationErrorHandler, registercontroller)
router.get('/verify-email', verifyemail )
router.get('/getme', authUser, getmecontroller)
router.post('/login', loginValidation, validationErrorHandler, logincontroller)





export default router;
