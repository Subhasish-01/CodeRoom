import { Button } from '../components/Button';
import Editor from "@monaco-editor/react";
import type {RefObject} from 'react'
import { socket } from '../services/socket';
import { MenuIcon } from '../assets/Menu';
import{useState} from "react"
interface Message {
    sender: string;
    message: string;
}
export interface DesktopRoomProps{
 roomId:string | undefined;
 users:string[];
 messages:Message[];
 currentUser: string;
  code: string;
  input: string;
  output: string;
  message: string;
  language: string;
  isRunning: boolean;

  setMessage: React.Dispatch<React.SetStateAction<string>>;
    setInput: React.Dispatch<React.SetStateAction<string>>;
    
    setLanguage: React.Dispatch<React.SetStateAction<string>>;
    setCode: React.Dispatch<React.SetStateAction<string>>;

 runCode: () => Promise<void>;
    sendMessage: () => void;
    copyRoomId: () => void;
    leaveRoom: () => void;

 

  messageEndRef: RefObject<HTMLDivElement | null>;
}


export function DesktopRoom({roomId,users, currentUser,messages,code,input, output,message,
    language,isRunning,setMessage,setInput,setLanguage, setCode,runCode,sendMessage,
    copyRoomId, leaveRoom,messageEndRef
}:DesktopRoomProps){
    const [showSidebar,setShowSidebar]=useState(false);
    return (
         <div className="h-screen overflow-hidden bg-slate-900 flex">
        <div className={`w-72 bg-slate-950 border-r border-slate-700 flex flex-col transition-transform duration-300 ease-in-out
        md:fixed md:left-0 md:top-0 md:h-screen md:z-40 xl:static xl:h-auto xl:translate-x-0 ${showSidebar?"translate-x-0":"-translate-x-full xl:translate-x-0"}`}>
           <div className="p-6 border-b border-slate-700">
            <p className="text-slate-400 text-sm">
                ROOM ID
            </p>
            <h1 className="text-3xl font-bold text-violet-500 mt-2">
                {roomId}
            </h1>
           </div>

           <div className="flex-1 p-6">
                <p className = "text-slate-400 mb-4">
                    CONNECTED
                </p>
                <div className="text-slate-400">
                    <div className="space-y-2">
                    {users.map((user,index) => (
                        <div
                            key={`${user}-${index}`}
                            className="bg-slate-800 text-white px-3 py-2 rounded-lg "
                            >
                            🟢 {user}
                         </div>
                        ))}
                        </div>
                </div>

            </div>

            <div className="space-y-3 p-4">
               <Button onClick={copyRoomId} varient="primary" text="Copy Room Id" size="md" fullwidth></Button> 
               <Button onClick={leaveRoom}  varient="secondary" text = "Leave Room" size="md" fullwidth></Button>
            </div>
          

        </div>
          {showSidebar && (
                <div className="hidden md:block xl:hidden fixed inset-0 bg-black/40 z-30"
                onClick={()=>setShowSidebar(false)}>

                </div>
            )}

        <div className="flex-1 flex flex-col min-h-0 ">
            <div className="h-16 border-b border-slate-700 flex items-center justify-between px-6">
                <button
                    onClick={() => setShowSidebar(true)}
                    className="hidden md:block xl:hidden text-white text-2xl cursor-pointer"
                >
                   <MenuIcon/>
                </button>
                <select 
                  value={language}
                  onChange={(e)=>{
                    const lang=e.target.value;
                    setLanguage(lang);
                    socket.emit(
                        "language-change",JSON.stringify({
                            roomId,
                            language:lang
                        })
                    )
                  }}
                  className = "bg-slate-800 text-white px-4 py-2 rounded-lg outline-none">
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                    <option value="python">Python</option>

                </select>
                <Button onClick={runCode} varient="secondary" text={isRunning?"Running...":"Run"} size="sm"></Button>
            </div>
             <div className="flex-1 flex min-h-0">
            <div className="flex-3 min-h-0 border-b border-slate-700">
                <Editor height="100%" theme="vs-dark" language={language} value={code} onChange={(value)=>{
                    const newCode = value || "";
                    setCode(newCode);
                    socket.emit(
                        "code-change",
                        JSON.stringify({
                            roomId,
                            code:newCode
                        })
                    )
                    socket.emit("clear-output",JSON.stringify({
                        roomId
                    }))
                }}/>
            </div>
            <div className="flex-2 min-h-0 p-4 flex flex-col">
                <div className="flex-1 border border-slate-700 rounded-lg p-4 overflow-y-auto mb-4 min-h-0 hide-scrollbar">
                    {messages.map((msg,index)=>{
                        const isMe=msg.sender===currentUser;
                        return(
                        <div
                            
                            key={index}
                            className={`flex mb-2 ${isMe?"justify-end":"justify-start"}`}>
                            <div
                            className={` text-white p-3 rounded-lg mb-2  max-w-[70%] break-all ${isMe?"bg-slate-600 text-white":"bg-slate-800 text-white"}`}
                            >
                                
                                <span className="text-xs font-semibold mb-1">
                                    {msg.sender}
                                </span>
                                <span>: </span>
                                <span>{msg.message}</span>
                                </div>
                        </div>
                        );
                        
                    })}
                    <div ref={messageEndRef}></div>
                </div>
                <div className="flex gap-2">
                    <input
                        value={message}
                        onChange={(e) =>
                            setMessage(e.target.value)
                        }
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                            sendMessage();
                            }
                        }}
                        placeholder="Type a message..."
                        className="flex-1 bg-slate-800 text-white px-4 py-3 rounded-lg outline-none"
                    />
                    <Button onClick={sendMessage} varient="primary" size="md" text="Send"></Button>
                </div>
            </div>
            </div>
            <div className="border-t border-slate-700 bg-slate-950 p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-2">
                        <p className="text-white font-semibold mb-2">
                            Custom Input
                        </p>
                        <textarea value={input} onChange={(e)=>{
                            const newInput=e.target.value;
                            setInput(newInput);
                            socket.emit("input-change",JSON.stringify({
                                roomId,
                                input:newInput
                            }));
                            
                            socket.emit("clear-output",JSON.stringify({
                               roomId
                             }))
                            
                        }} placeholder="Enter i/p ..."
                         className="w-full h-32 bg-slate-800 text-white rounded-lg p-3 outline-none resize-none"/>
                    </div>

                    <div className="flex-3">
                        <p className="text-white font-semibold mb-2">
                            Output
                        </p>
                        <pre className="h-32 bg-slate-900 text-green-400 rounded-lg p-3 overflow-auto whitespace-pre-wrap hide-scrollbar">
                            {output}
                        </pre>
                    </div>

                </div>
                
            </div>

            

        </div>

    </div>
    )
}