import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
    try{
        console.log("Value of process.env.MONGO_URL",process.env.MONGO_URL);
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB connected successfully");
    }catch(err){
        console.error("MongoDB connection failed", err);
        process.exit(1); // Exit the process with failure
    }
}
export default connectDB;