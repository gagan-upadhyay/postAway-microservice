import express from 'express';
import {login, register} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/', (req, res)=>{
    res.status(200).send("Welcome to auth-service")
    console.log("API Get Request");
})

export default router;