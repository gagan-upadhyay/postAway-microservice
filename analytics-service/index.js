import express from 'express';
import dotenv from 'dotenv';


const app = express();
dotenv.config();

const PORT = process.env.PORT || 7000;

app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`);
});