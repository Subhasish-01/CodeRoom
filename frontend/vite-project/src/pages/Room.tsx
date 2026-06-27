import axios from 'axios'
import {useParams} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect,useState,useRef} from "react";
import { DesktopRoom } from './DesktopRoom';
import { socket } from "../services/socket";
import { BACKEND_URL } from "../config";
import { MobileRoom } from './MobileRoom';
import toast from 'react-hot-toast';

export function Room() {

  const { roomId } = useParams();
  const navigate = useNavigate();
  const [message,
    setMessage] = useState("");
  const[code,setCode]=useState("// Start coding..")
  const [output,setOutput]=useState("");
  const [input,setInput]=useState("");
  const[language,setLanguage]=useState("cpp")
  interface Message{
    sender:string,
    message:string;
  }
  const [messages, setMessages] = useState<Message[]>([]);
   const [users,setUsers]=useState<string[]>([]) ;
   const[currentUser,setCurrentUser]=useState("");

   const messageEndRef=useRef<HTMLDivElement>(null);
   const autoSaveRef = useRef<number | null>(null);
   const[isRunning,setIsRunning]=useState(false);
   
   useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!socket.connected && token) {
        socket.auth = { token };
        socket.connect();
    }
}, []);

   useEffect(()=>{
    axios.get(`${BACKEND_URL}/me`,{
        headers:{
            authorization:
            sessionStorage.getItem(
                "token"
            )
        }
    }).then((res)=>{
        setCurrentUser(
            res.data.username
        )
    })
   },[])

   
  useEffect(() => {

  if (!currentUser || !roomId) return;

  const handleConnect = () => {

    console.log(
      "REJOINING ROOM"
    );
    console.log("JOIN ROOM CALLED");
    socket.emit(
      "join-room",
      JSON.stringify({
        roomId
      })
    );
    console.log("JOIN EMITTED");
  };
  if(socket.connected){
    handleConnect();
  }

  socket.on(
    "connect",
    handleConnect
  );

  socket.on(
    "disconnect",
    () => {
      console.log(
        "DISCONNECTED"
      );
    }
  );

  return () => {
    socket.off(
      "connect",
      handleConnect
    );
  };

}, [roomId, currentUser]);

useEffect(() => {

  return () => {

    if (!currentUser || !roomId) return;

    socket.emit(
      "leave-room",
      JSON.stringify({
        roomId
      })
    );

  };

}, [roomId, currentUser]);

  useEffect(() => {
   
    if(!currentUser)return;
    
    
    socket.on("code-update",(newCode)=>{
        console.log("received code:", newCode)
        setCode(newCode);
    })
     
    socket.on("sync-code",(savedCode)=>{
        setCode(savedCode);
    });
    
    socket.on("language-update",(lang:any)=>{
        setLanguage(lang);
    })
    socket.on("room-full", () => {
    toast.error("Room is full! Maximum 6 users are allowed.");
    navigate("/home");
    });
    socket.on("sync-language",(lang)=>{setLanguage(lang)});
    socket.on(
        "room-users",
        (users) => {
            console.log("Room user received:",
                users
            );
            setUsers(users);
        }
    );
    socket.on("input-update",(newInput)=>{
        setInput(newInput);
    })
    socket.on("output-update",(newOutput)=>{
        setOutput(newOutput);
    })

    socket.on(
      "received-message",
      (data) => {
         console.log("message received",data);
        setMessages(prev => [
          ...prev,
          data
        ]);

      }
    );
    socket.on("sync-input",(savedInput)=>{
        setInput(savedInput);
    })
    socket.on("sync-output",(savedOutput)=>{
        setOutput(savedOutput);
    })
    socket.on("run-start",()=>{
        setIsRunning(true);
    })
    socket.on("run-end",()=>{
        setIsRunning(false);
    })
    socket.on("sync-messages",(msgs)=>{
        setMessages(msgs);
    })

    return () => {
      socket.off(
        "received-message"
      );
      socket.off("room-users");
      socket.off("code-update");
      socket.off("sync-code");
      socket.off("language-update");
      socket.off("sync-language");
      socket.off("input-update");
      socket.off("output-update");
      socket.off("sync-input");
      socket.off("sync-output");
      socket.off("run-start");
      socket.off("run-end");
      socket.off("sync-messages");
      socket.off("room-full");
    };

  }, [roomId,currentUser]);

  useEffect(()=>{
     messageEndRef.current?.scrollIntoView({
        behavior:"smooth"
    })
   },[messages]);

   useEffect(()=>{
    if(!roomId || !currentUser)return ;
    if(autoSaveRef.current){
        clearTimeout(autoSaveRef.current);
    }
    autoSaveRef.current=setTimeout(async()=>{
        
        try{
            await axios.post(
                `${BACKEND_URL}/room/save`,
                {
                    roomId,
                    code,
                    language
                },
                {
                headers:{
                    authorization:sessionStorage.getItem("token")
                }
            }
            );
            console.log("Auto save");
        }catch(e){
            console.log("Auto Save FAiled")
        }
    },3000);
    return()=>{
        if(autoSaveRef.current){
            clearTimeout(autoSaveRef.current);
        }
    }
   },[code,language])
   
   
   async function runCode(){
    if(isRunning)return;
    socket.emit("run-start",JSON.stringify({
        roomId
    }))
    setIsRunning(true);
    try{
        const res = await axios.post(
            `${BACKEND_URL}/run`,
            {
                roomId,
                code,
                language,
                input
            }
        );
        setOutput(res.data.output);
    }catch(e){
        setOutput("Error while running code ");
    } finally{
        socket.emit("run-end",JSON.stringify({
            roomId
        }))
        setIsRunning(false);
    }
   }

  function sendMessage() {

    socket.emit(
      "send-message",
      JSON.stringify({
        roomId,
        message,
        sender:currentUser
          
      })
    );

    setMessage("");

  }
   function copyRoomId() {
    navigator.clipboard.writeText(roomId || "");
    toast.success("Room ID copied!");
  }

  function leaveRoom() {
    socket.emit("leave-room",JSON.stringify({
        roomId
       
    })
   )
   socket.off("received-message");
   socket.off("room-users");
    navigate("/home");
  }
  console.log(users);
  console.log("MESSAGES STATE:", messages);
  return (
  <>
  <div className="hidden lg:block">
   <DesktopRoom roomId={roomId} users={users} messages={messages} currentUser={currentUser} code={code}
   input={input} output={output} message={message} language={language} isRunning={isRunning} setMessage={setMessage}
   setInput={setInput}  setLanguage={setLanguage} setCode={setCode} runCode={runCode} sendMessage={sendMessage}
       copyRoomId={copyRoomId}  leaveRoom={leaveRoom}  messageEndRef={messageEndRef}
/>   
   </div>
   
   <div className="block lg:hidden">
   <MobileRoom roomId={roomId} users={users} messages={messages} currentUser={currentUser} code={code}
   input={input} output={output} message={message} language={language} isRunning={isRunning} setMessage={setMessage}
   setInput={setInput}  setLanguage={setLanguage} setCode={setCode} runCode={runCode} sendMessage={sendMessage}
       copyRoomId={copyRoomId}  leaveRoom={leaveRoom}  messageEndRef={messageEndRef}
/>
   </div>
</>
  )
}