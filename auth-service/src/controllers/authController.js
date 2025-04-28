import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
    try{
        const {username, email, password, gender} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("hashed password step done...");
        console.log("before saving user");
        const newUser = new UserModel({
            username,
            email,
            password:hashedPassword,
            gender
        });
        const savedUser = await newUser.save();
        console.log("after saving user");
      //  // const token = jwt.sign({id:savedUser._id}, process.env.JWT_SECRET, {expiresIn:"1h"});
        res.status(201).json({
            message:"User registered successfully",
            user:{
                id:savedUser._id,
                username:savedUser.username,
                email:savedUser.email,
              //  // token:token
            }
        });
            
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal server error"});
    }
};

const login = async(req, res)=>{
    try{
        const {email, password} = req.body;
        const isUser = await UserModel.findOne({email});
        if(!isUser){
            res.send(404).send("user not regitered, Please SignUp first!");
        }
        const isPasswordCorrect = bcrypt.compare(isUser.password, password);
        if(!isPasswordCorrect){
            return res.status(400).json({message:"Invalid credentials"});
        }
        const token = jwt.sign({id:isUser._id}, process.env.JWT_SECRET, {expiresIn:"1h"});
        return res.status(200).json({
            message:"User logged in successfully",
            token:token,
            user:{
                id:isUser._id,
                username:isUser.username,
                email:isUser.email,
            }
        });

    }catch(err){
        console.error(err);
        return res.status(500).json({message:"Internal server error"});
    }
};

const forgetPassword= async(req, res)=>{
    try{
        const {email} = req.body;
        const isUser = await UserModel.find({email});
        if(!isUser){
            return res.status(404).json({message:"User not found"});
        }
        

    }catch(err){
        logger.error(err);
        return res.status(500).json({message:"Internal server error"});
    }
}

export {register,login};