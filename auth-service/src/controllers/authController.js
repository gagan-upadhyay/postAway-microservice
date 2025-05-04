import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";

// const bulkRegister = async (req, res) => {
//     try{
//         const users = req.body;
//         if(!users || users.length === 0){
//             logger.error("Please provide users data");
//             return res.status(400).json({message:"Please provide users data"});
//         }
//         const isUser = await UserModel.find({email:{$in:users.map(user => user.email)}});
//         // res.status(400).json({message:"User already exists"});
//         if(isUser && isUser.length > 0){
//             logger.error("User already exists");
//             return res.status(400).json({message:"User already exists"});
//         }
//         // Hashing passwords for all users
//         const hashedUsers = await Promise.all(users.map(async (user) => {
//             const hashedPassword = await bcrypt.hash(user.password, 10);
//             return {...user, password: hashedPassword};
//         }));
//         logger.debug("hashed users", hashedUsers);
//         const savedUsers = await UserModel.insertMany(hashedUsers, {ordered: false});
//         logger.info(savedUsers);
//         return res.status(201).json({
//             message:"Users registered successfully",
//             users:savedUsers.map(user => ({
//                 id:user._id,
//                 username:user.username,
//                 email:user.email,
//             }))
//         });
//     }catch(err){
//         logger.error(err);
//         console.error(err);
//         return res.status(500).json({message:"Internal server error"});
//     }
// }

const bulkRegister = async (req, res) => {
    try {
      const {users} = req.body; // expecting an array of user objects
      if (users.length === 0 || !users) {
        return res.status(400).json({ message: "Expected an array of users" });
      }

    //   const hashedUsers = await Promise.all(
    //     users.map(async (user) => {
    //         try {
    //             if (!user.password) {
    //                 throw new Error(`Password is missing for user: ${user.email || 'unknown email'}`);
    //             }
    //             const hashedPassword = await bcrypt.hash(user.password, 10);
    //             return {
    //                 ...user,
    //                 password: hashedPassword
    //             };
    //         } catch (err) {
    //             logger.error(`Error hashing password for user: ${user.email || 'unknown email'}`, err);
    //             throw err; // Optionally, handle errors for individual users instead of failing the entire operation
    //         }
    //     })
    // );


      const hashedUsers = await Promise.all(
        users.map(async (user) => {
            try{
                const hashedPassword = await bcrypt.hash(user.password, 10);
                return {
                ...user,
                password: hashedPassword
                };
            }catch(e){
                logger.error(`Error hashing password for user: ${user.email}|| unknown email`, err);
                throw err;
            }
            
        }));
  
      const savedUsers = await UserModel.insertMany(hashedUsers, { ordered: false }); // ordered:false to skip duplicate errors
      res.status(201).json({
        message: "Users registered successfully",
        count: savedUsers.length,
        users: savedUsers.map(u => ({
          id: u._id,
          username: u.username,
          email: u.email
        }))
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error", error: err.message });
    }
  };
  

const register = async (req, res) => {
    try{
        const {username, email, password, gender} = req.body;
        const isUser = await UserModel.findOne({email});
        if(isUser){
            logger.error("User already exists");
            return res.status(400).json({message:"User already exists"});
        }
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
        logger.info(savedUser);
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
        logger.error(err);
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

const resetPassword = async(req, res)=>{
    try{
        const {password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const isUser = await UserModel.findOne({email});
        if(!isUser){
            return res.status(404).json({message:"User not found"});
        }  
        const updatedUser = await UserModel.findByIdAndUpdate(isUser._id, {
            password:hashedPassword
        }, {new:true});
        if(!updatedUser){
            return res.status(404).json({message:"User not found"});
        }
        return res.status(200).json({
            message:"Password updated successfully",
            user:{
                id:updatedUser._id,
                username:updatedUser.username,
                email:updatedUser.email,
            }
        });
    }catch(err){
        console.error(err);
        return res.status(500).json({message:"Internal server error"});
    }
};


export {register,login, forgetPassword, resetPassword, bulkRegister};