import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";


export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("inside the error boundary");
        return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    try{
        const decoded =jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({ message: "Unauthorized msg from authmiddleware" });
        }
        logger.info(decoded);
        req.user = decoded; // Assuming the token contains user information
        
    }catch(err){
        logger.error(err);
        return res.status(401).json({ message: "Invalid or  expired token" });
    
    };
    next();
}

