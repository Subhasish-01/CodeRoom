import {Server,Socket} from "socket.io"
import { RoomModel } from "../models/Room";
import{roomCode,roomLanguage,roomInput,roomOutput,roomMessages} from "../roomState"
const roomUsers: Record<string, string[]> = {};
import jwt from "jsonwebtoken"
import { UserModel } from "../models/User";


const socketMap = new Map<
  string,
  {
    roomId: string;
    username: string;
  }
>();

export const initializeSocket = (io:Server)=>{
    io.use(async(socket,next)=>{
        const token = socket.handshake.auth.token;
        if(!token){
            return next(new Error("Unauthorized"));
        }
        try{
            const decoded = jwt.verify(token,
                process.env.JWT_SECRET!
            ) as {id:string};
            const user = await UserModel.findById(decoded.id);
            if(!user){
                 return next(new Error("User not found"));
            }
            socket.data.user={
                id:user._id,
                username:user.username
            };
            next();
        }catch(e){
            next(new Error("Invalid token"));
        }
    })
    io.on("connection",(socket:Socket)=>{
        console.log("User Connected:",socket.id);
        console.log("Socket user:", socket.data.user);
            socket.on("join-room", async(data) => {

            const { roomId } =
            JSON.parse(data);
            const username = socket.data.user.username;
            socket.join(roomId);
            let code = roomCode[roomId];
            let language = roomLanguage[roomId];
            let input=roomInput[roomId];
            let output=roomOutput[roomId];
            if(!code || !language){
                const room = await RoomModel.findOne({roomId});
                if(room){
                    code=room.code;
                    language= room.language

                    roomCode[roomId]=code;
                    roomLanguage[roomId]= language;
                }
            }
            socket.emit(
                "sync-code",
                 code || "//Start coding..."
            )
            socket.emit("sync-language",language || "cpp");
            socket.emit("sync-input",input || "");
            socket.emit("sync-output",output || "");
             console.log("Sync messages:", roomMessages[roomId]);
            socket.emit("sync-messages",roomMessages[roomId] || [])
           

            if (!roomUsers[roomId]) {
                roomUsers[roomId] = [];
            }
            if(roomUsers[roomId].length>=6 && !roomUsers[roomId].includes(username)){
                socket.emit("room-full");
                return ;

            }
           
            if(!roomUsers[roomId].includes(username)){
            roomUsers[roomId].push(username);
            roomUsers[roomId].sort();
            }

            socketMap.set(socket.id, {
                roomId,
                username
            });

            io.to(roomId).emit(
                "room-users",
                [...roomUsers[roomId]]
            );

            console.log(
                `${username} joined room ${roomId}`
            );
           console.log("ROOM USERS:", roomUsers);
        });
        socket.on("language-change",(data)=>{
            const {roomId,language}=JSON.parse(data);
            roomLanguage[roomId]=language;
            io.to(roomId).emit(
                "language-update",language
            )
        })
    socket.on("send-message", (data) => {
    const { roomId, message,sender} = JSON.parse(data);

    console.log("Message received:", roomId, message);
    if(!roomMessages[roomId]){
        roomMessages[roomId]=[]
    }
    roomMessages[roomId].push({
        sender,
        message
    });

        io.to(roomId).emit("received-message", {
        sender,
        message
   });
    });
    
    socket.on("code-change",(data)=>{
        const{roomId,code}=JSON.parse(data);
        console.log("Code-change:",roomId)
        roomCode[roomId]=code;
        
        socket.to(roomId).emit(
            "code-update",
            code
        )
    })
    
    socket.on("input-change",(data)=>{
        const{roomId,input}=JSON.parse(data);
        roomInput[roomId]=input;
        socket.to(roomId).emit(
            "input-update",
            input
        )
    })
    socket.on("clear-output",(data)=>{
        const {roomId}=JSON.parse(data);

        io.to(roomId).emit(
            "output-update",
            ""
        )
    })
    socket.on("run-start",(data)=>{
        const{roomId}=JSON.parse(data);
        io.to(roomId).emit("run-start");
    })
    socket.on("run-end",(data)=>{
        const{roomId}=JSON.parse(data);
        io.to(roomId).emit("run-end");
    })

    socket.on("leave-room",(data)=>{
        const {roomId}=JSON.parse(data);
        const username=socket.data.user.username;
        if(roomUsers[roomId]){
            roomUsers[roomId]=roomUsers[roomId].filter(
                u=>u!==username
            );
            socket.leave(roomId);
            socketMap.delete(socket.id);
            io.to(roomId).emit(
                "room-users",
                [...roomUsers[roomId]]
            );
            console.log(
                `${username} left ${roomId}`
            )
            console.log("Room Users:",roomUsers)
        }
    })

     socket.on("disconnect", () => {

    const user =
      socketMap.get(socket.id);

    if (user &&
    roomUsers[user.roomId]) {

        roomUsers[user.roomId] =
            roomUsers[user.roomId]!
            .filter(
                u => u !== user.username
            );
        const users =
              [...roomUsers[user.roomId]!];
        io.to(user.roomId).emit(
            "room-users",
            users
        );

        socketMap.delete(socket.id);
        console.log(
          "After disconnect:",
          roomUsers
        );
    }

    console.log(
        "User disconnected:",
        socket.id
    );
   });
    })
}