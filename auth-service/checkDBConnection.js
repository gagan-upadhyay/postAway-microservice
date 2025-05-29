import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config();
const url = process.env.MONGO_URL

const connectUsingMongoose = async()=>{
    try{
        console.log("Value of url", url);
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Database connected to Atlas Mongoose");
    }catch(err){
        console.log(err);
    }
}

connectUsingMongoose();