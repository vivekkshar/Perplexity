import { Router } from 'express';
import {registercontroller, logincontroller }from "../controllers/auth.controller.js"
import { registerValidation, validationErrorHandler } from "../validators/auth.validator.js"


const router = Router();


router.post('/register', registerValidation, validationErrorHandler, registercontroller)
router.post('/login', logincontroller)





export default router;
