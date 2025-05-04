import express from 'express';
import {forgetPassword, login, register, bulkRegister} from '../controllers/authController.js';
import {registerValidator, loginValidator, bulkRegisterValidator} from '../middlewares/ValidatorMiddleWare.js';

const router = express.Router();

router.post('/register',registerValidator, register);
router.post('/login', loginValidator,login);
router.post('/forget-password', forgetPassword);
router.post('/bulk-register', bulkRegister);

router.get('/', (req, res)=>{
    res.status(200).send("Welcome to auth-service")
    console.log("API Get Request");
})

export default router;