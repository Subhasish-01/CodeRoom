import express from "express";
import mongoose from "mongoose";
import {UserModel} from "./models/User"
import bcrypt from "bcryptjs"
import dotenv from "dotenv"
import  jwt  from "jsonwebtoken";
import {connectdb} from "./config/db";
import {RoomModel} from "./models/Room"
import { authMiddleware} from "./middleware/authMiddleware";
import { createServer } from "http";
import { Server } from "socket.io";
import { initializeSocket } from "./sockets/socket";
import { roomOutput } from "./roomState";
import axios from 'axios'
import cors from 'cors'
dotenv.config();
connectdb();

const app = express();
app.use(express.json());
app.use(cors());

app.post("/signup",async(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    try{
        const hashedPassword = await bcrypt.hash(password,10);
        await UserModel.create({
            username:username,
            password:hashedPassword
        })
        res.json({
            message:"User signed up"
        })
    }
    catch(e){
        res.status(411).json({
            message:"Username already exist"
        })
    }
})

app.post("/signin",async(req,res)=>{
    const username=req.body.username;
    const password = req.body.password;

    const existUser = await UserModel.findOne({
        username,
        
    })
    if(!existUser){
      return res.status(404).json({
        message:"user not found"
      })
    }
    const passwordMatch = await bcrypt.compare(
        password,
        existUser.password
    )
     if (!passwordMatch) {
        return res.status(401).json({
            message: "Invalid credentials"
        });
    }
    const token = jwt.sign (
        {
            id:existUser._id
        },
        process.env.JWT_SECRET!
    );
    res.json({
        token,
        userId:existUser._id,
        username:existUser.username
    })

})

app.get("/me",authMiddleware,async(req,res)=>{
    const user = await UserModel.findById(
        (req as any).userId
    )
    if(!user){
        return res.status(404).json({
            message:"User not found"
        });
    }
    res.json({
        userId:user._id,
        username:user.username
    })
})

app.post("/room/create",authMiddleware,async(req,res)=>{
    const roomId = Math.random().toString(36).substring(2,8).toUpperCase()
    const room = await RoomModel.create({
        roomId,
        owner:(req as any).userId
    })
    res.json({
        roomId:room.roomId
    })
})

app.post("/room/save",authMiddleware,async(req,res)=>{
 const {roomId,code,language}=req.body;
 await RoomModel.updateOne(
    {roomId},
    {
        $set:{
            code,
            language
        }
    }
 );
 res.json({
    message:"Room saved successfully"
 })
})

app.get("/room/:roomId",authMiddleware,async(req,res)=>{
    const roomId = req.params.roomId;
    if (!roomId) {
    return res.status(400).json({
        message: "Room id required"
    });
    }
    const room = await RoomModel.findOne({
        roomId
    });
    if(!room){
        return res.status(404).json({
            message:"Room not found"
        })
    }
    res.json({
        roomId:room.roomId,
        owner:room.owner
    });
})

app.post("/run",async(req,res)=>{
    try{
      const{roomId,code,language,input} = req.body;
      const languageMap:Record<string,{
        language:string;
        versionIndex:string;
      }>={
        cpp:{
            language:"cpp17",
            versionIndex:"3"
        },
        
        python:{
            language:"python3",
            versionIndex:"6"
        },
        java:{
            language:"java",
            versionIndex:"6"
        }
        }
      
      const selectedLanguage=languageMap[language];
      if(!selectedLanguage){
        return res.status(400).json({
            output:"Unsupported language"
        });
      }
      const response = await axios.post(
        "https://api.jdoodle.com/v1/execute",
        {
        clientId: process.env.JDOODLE_CLIENT_ID,
        clientSecret: process.env.JDOODLE_CLIENT_SECRET,
        script: code,
        stdin: input,
        language: selectedLanguage.language,   
        versionIndex: selectedLanguage.versionIndex
        }


      );
      const output = response.data.output;
      roomOutput[roomId] = output;
      io.to(roomId).emit("output-update",output);
      res.json({
        output
      })
    }catch(e){
        console.error(e);
        res.status(500).json({
            output:"Error while running code "
        })
    }
})

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

initializeSocket(io);

const PORT = process.env.PORT;

server.listen(PORT);