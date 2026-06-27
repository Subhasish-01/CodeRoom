import dotenv from "dotenv"
dotenv.config();
import mongoose from "mongoose"

export const connectdb=async()=>{
   try{
    await mongoose.connect(process.env.MONGO_URL!);
    console.log("MongoDB connected",mongoose.connection.name);
   }
   catch(error){
    console.log("connection failed:",error)
   }
}
